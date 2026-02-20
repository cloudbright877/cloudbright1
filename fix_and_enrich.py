"""
Fix the database:
1. Parse contact info (email, telegram, instagram, etc.) for ALL channels with YouTube URLs
2. Sync new entries to 'All Bloggers' sheet
3. Update 'Projects & Network' sheet
"""
import subprocess, re, openpyxl, os, json, sys
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed

os.environ['PYTHONIOENCODING'] = 'utf-8'

def get_channel_contacts(channel_url):
    """Get contact info from YouTube channel about page using yt-dlp"""
    try:
        url = channel_url.rstrip('/')
        if not url.startswith('http'):
            url = 'https://' + url

        # Get channel metadata via dump-json on the channel page
        r = subprocess.run(
            ['python', '-m', 'yt_dlp',
             url,
             '--playlist-items', '1:1',
             '--dump-single-json',
             '--no-warnings', '--quiet'],
            capture_output=True, text=True, encoding='utf-8', errors='replace',
            timeout=60
        )

        text = r.stdout
        contacts = {
            'email': '',
            'telegram': '',
            'instagram': '',
            'twitter': '',
            'whatsapp': '',
            'facebook': '',
            'other': '',
            'description': '',
        }

        if not text:
            return contacts

        try:
            data = json.loads(text)
        except:
            data = {}

        # Get description from channel
        desc = data.get('description', '') or ''
        uploader = data.get('uploader', '') or ''
        channel_desc = data.get('channel', '') or ''

        # Also check for links in the raw JSON
        all_text = text[:50000]  # First 50K chars

        # Extract emails
        emails = re.findall(r'[\w.+-]+@[\w-]+\.[\w.-]+', all_text)
        # Filter out common non-personal emails
        filtered_emails = [e for e in emails if not any(x in e.lower() for x in
            ['@youtube.', '@google.', '@example.', '@email.', 'noreply', 'support@',
             'info@youtube', '@yt.', '@ytimg.', '@googleapis.'])]
        if filtered_emails:
            contacts['email'] = filtered_emails[0]

        # Telegram
        tg_patterns = [
            r'(?:t\.me|telegram\.me)/([a-zA-Z0-9_]+)',
            r'telegram[:\s]+@?([a-zA-Z0-9_]+)',
        ]
        for pat in tg_patterns:
            tg = re.findall(pat, all_text, re.IGNORECASE)
            if tg:
                contacts['telegram'] = f't.me/{tg[0]}'
                break

        # Instagram
        ig = re.findall(r'(?:instagram\.com)/([a-zA-Z0-9_.]+)', all_text, re.IGNORECASE)
        if ig:
            contacts['instagram'] = f'instagram.com/{ig[0]}'

        # Twitter/X
        tw = re.findall(r'(?:twitter\.com|x\.com)/([a-zA-Z0-9_]+)', all_text, re.IGNORECASE)
        if tw:
            # Filter out common Twitter paths
            valid_tw = [t for t in tw if t.lower() not in ('intent', 'share', 'home', 'search', 'i', 'hashtag')]
            if valid_tw:
                contacts['twitter'] = f'x.com/{valid_tw[0]}'

        # WhatsApp
        wa = re.findall(r'(?:wa\.me|whatsapp\.com/(?:channel|send))/([a-zA-Z0-9+]+)', all_text, re.IGNORECASE)
        if wa:
            contacts['whatsapp'] = f'wa.me/{wa[0]}'

        # Facebook
        fb = re.findall(r'(?:facebook\.com|fb\.com)/([a-zA-Z0-9.]+)', all_text, re.IGNORECASE)
        if fb:
            valid_fb = [f for f in fb if f.lower() not in ('sharer', 'share', 'dialog', 'plugins', 'tr')]
            if valid_fb:
                contacts['facebook'] = f'facebook.com/{valid_fb[0]}'

        # Other links (Discord, website, etc.)
        discord = re.findall(r'discord\.gg/([a-zA-Z0-9]+)', all_text, re.IGNORECASE)
        if discord:
            contacts['other'] = f'discord.gg/{discord[0]}'

        # Short description for niche
        contacts['description'] = desc[:200] if desc else ''

        return contacts

    except Exception as e:
        return {
            'email': '', 'telegram': '', 'instagram': '', 'twitter': '',
            'whatsapp': '', 'facebook': '', 'other': '', 'description': '',
        }


def determine_quality(contacts):
    """Determine contact quality based on available info"""
    score = 0
    if contacts['email']:
        score += 3
    if contacts['telegram']:
        score += 2
    if contacts['instagram']:
        score += 1
    if contacts['twitter']:
        score += 1
    if contacts['whatsapp']:
        score += 1
    if contacts['facebook']:
        score += 1

    if score >= 4:
        return 'HIGH'
    elif score >= 2:
        return 'MEDIUM'
    elif score >= 1:
        return 'LOW'
    else:
        return 'NONE'


def main():
    print("=" * 60)
    print("FIX & ENRICH: Parsing contacts, syncing sheets")
    print("=" * 60)

    wb = openpyxl.load_workbook('YouTubers_Report_v2.xlsx')

    contacts_ws = wb['Contacts']
    bloggers_ws = wb['All Bloggers']
    projects_ws = wb['Projects & Network']

    # Step 1: Read all channels from Contacts sheet
    print("\nReading Contacts sheet...")
    all_channels = []
    for row_idx in range(2, contacts_ws.max_row + 1):
        ch = {
            'row': row_idx,
            'num': contacts_ws.cell(row=row_idx, column=1).value,
            'name': contacts_ws.cell(row=row_idx, column=2).value,
            'subs': contacts_ws.cell(row=row_idx, column=3).value,
            'category': contacts_ws.cell(row=row_idx, column=4).value,
            'country': contacts_ws.cell(row=row_idx, column=5).value or '',
            'email': contacts_ws.cell(row=row_idx, column=6).value or '',
            'telegram': contacts_ws.cell(row=row_idx, column=7).value or '',
            'instagram': contacts_ws.cell(row=row_idx, column=8).value or '',
            'twitter': contacts_ws.cell(row=row_idx, column=9).value or '',
            'whatsapp': contacts_ws.cell(row=row_idx, column=10).value or '',
            'facebook': contacts_ws.cell(row=row_idx, column=11).value or '',
            'other': contacts_ws.cell(row=row_idx, column=12).value or '',
            'quality': contacts_ws.cell(row=row_idx, column=13).value or '',
            'url': contacts_ws.cell(row=row_idx, column=14).value or '',
        }
        if ch['name']:
            all_channels.append(ch)

    print(f"Total channels in Contacts: {len(all_channels)}")

    # Step 2: Find channels that need contact parsing (no email AND no telegram = needs parsing)
    needs_parsing = []
    for ch in all_channels:
        if not ch['email'] and not ch['telegram'] and ch['url']:
            needs_parsing.append(ch)

    print(f"Channels needing contact parsing: {len(needs_parsing)}")

    # Step 3: Parse contacts in parallel
    if needs_parsing:
        print(f"\nParsing contacts for {len(needs_parsing)} channels (5 workers)...")

        results = {}
        with ThreadPoolExecutor(max_workers=5) as ex:
            futures = {}
            for ch in needs_parsing:
                url = ch['url']
                if not url.startswith('http'):
                    url = 'https://' + url
                futures[ex.submit(get_channel_contacts, url)] = ch

            done = 0
            for f in as_completed(futures):
                done += 1
                ch = futures[f]
                contacts = f.result()
                results[ch['row']] = contacts

                if done % 50 == 0 or done == len(futures):
                    emails_found = sum(1 for c in list(results.values()) if c['email'])
                    tg_found = sum(1 for c in list(results.values()) if c['telegram'])
                    print(f"  [{done}/{len(futures)}] Emails: {emails_found}, Telegrams: {tg_found}")

        # Write contacts back to Contacts sheet
        contacts_added = 0
        for row_idx, contacts in results.items():
            if contacts['email']:
                contacts_ws.cell(row=row_idx, column=6, value=contacts['email'])
                contacts_added += 1
            if contacts['telegram']:
                contacts_ws.cell(row=row_idx, column=7, value=contacts['telegram'])
            if contacts['instagram']:
                contacts_ws.cell(row=row_idx, column=8, value=contacts['instagram'])
            if contacts['twitter']:
                contacts_ws.cell(row=row_idx, column=9, value=contacts['twitter'])
            if contacts['whatsapp']:
                contacts_ws.cell(row=row_idx, column=10, value=contacts['whatsapp'])
            if contacts['facebook']:
                contacts_ws.cell(row=row_idx, column=11, value=contacts['facebook'])
            if contacts['other']:
                contacts_ws.cell(row=row_idx, column=12, value=contacts['other'])

            # Update quality
            quality = determine_quality(contacts)
            contacts_ws.cell(row=row_idx, column=13, value=quality)

        print(f"\nContacts updated: {contacts_added} new emails found")

    # Step 4: Sync ALL channels from Contacts to All Bloggers
    print("\nSyncing to All Bloggers sheet...")

    # Read existing All Bloggers entries
    existing_bloggers = set()
    for row_idx in range(2, bloggers_ws.max_row + 1):
        name = bloggers_ws.cell(row=row_idx, column=2).value
        if name:
            existing_bloggers.add(name.strip().lower())

    # Re-read contacts with updated data
    bloggers_added = 0
    next_bloggers_row = bloggers_ws.max_row + 1
    next_bloggers_num = bloggers_ws.max_row  # last # value

    for row_idx in range(2, contacts_ws.max_row + 1):
        name = contacts_ws.cell(row=row_idx, column=2).value
        if not name:
            continue
        if name.strip().lower() in existing_bloggers:
            continue

        subs = contacts_ws.cell(row=row_idx, column=3).value
        url = contacts_ws.cell(row=row_idx, column=14).value
        category = contacts_ws.cell(row=row_idx, column=4).value
        country = contacts_ws.cell(row=row_idx, column=5).value or ''
        email = contacts_ws.cell(row=row_idx, column=6).value or ''
        quality_contact = contacts_ws.cell(row=row_idx, column=13).value or ''

        # Map quality
        try:
            subs_num = int(str(subs).replace(',', '').replace(' ', ''))
        except:
            subs_num = 0

        if subs_num >= 100000:
            quality = 'HIGH'
        elif subs_num >= 10000:
            quality = 'MEDIUM'
        elif subs_num >= 1000:
            quality = 'LOW'
        else:
            quality = 'MICRO'

        # Determine niche
        niche = 'Crypto / Passive Income'
        if category and 'mining' in str(category).lower():
            niche = 'Crypto Mining'
        elif category and 'nft' in str(category).lower():
            niche = 'NFT / Earning'

        next_bloggers_num += 1
        # All Bloggers columns: #, Channel Name, Subscribers, YouTube URL, Category, Country/Region,
        #                       Niche, Role/Description, Quality, Fake/Bot Risk, MLM Score, Notes
        bloggers_ws.cell(row=next_bloggers_row, column=1, value=next_bloggers_num)
        bloggers_ws.cell(row=next_bloggers_row, column=2, value=name)
        bloggers_ws.cell(row=next_bloggers_row, column=3, value=subs)
        bloggers_ws.cell(row=next_bloggers_row, column=4, value=url)
        bloggers_ws.cell(row=next_bloggers_row, column=5, value=category)
        bloggers_ws.cell(row=next_bloggers_row, column=6, value=country)
        bloggers_ws.cell(row=next_bloggers_row, column=7, value=niche)
        bloggers_ws.cell(row=next_bloggers_row, column=8, value=f'{category} coverage')
        bloggers_ws.cell(row=next_bloggers_row, column=9, value=quality)
        bloggers_ws.cell(row=next_bloggers_row, column=10, value='MEDIUM')
        bloggers_ws.cell(row=next_bloggers_row, column=11, value=None)
        bloggers_ws.cell(row=next_bloggers_row, column=12, value=None)

        existing_bloggers.add(name.strip().lower())
        next_bloggers_row += 1
        bloggers_added += 1

    print(f"Added {bloggers_added} channels to All Bloggers")

    # Step 5: Update Projects & Network sheet
    print("\nUpdating Projects & Network...")

    # Get current project list
    existing_projects = set()
    for row_idx in range(2, projects_ws.max_row + 1):
        proj = projects_ws.cell(row=row_idx, column=2).value
        if proj:
            existing_projects.add(proj.strip())

    # Count channels per project from Contacts
    project_counts = Counter()
    for row_idx in range(2, contacts_ws.max_row + 1):
        cat = contacts_ws.cell(row=row_idx, column=4).value
        if cat:
            project_counts[cat] += 1

    # Add new projects
    next_proj_row = projects_ws.max_row + 1
    next_proj_num = projects_ws.max_row  # last #

    new_projects_added = 0
    for proj, count in project_counts.most_common():
        if proj in existing_projects:
            # Update count for existing projects
            for row_idx in range(2, projects_ws.max_row + 1):
                if projects_ws.cell(row=row_idx, column=2).value == proj:
                    projects_ws.cell(row=row_idx, column=4, value=f'{count} channels (see All Bloggers)')
                    projects_ws.cell(row=row_idx, column=5, value=count)
                    break
            continue

        next_proj_num += 1

        # Determine type
        proj_lower = proj.lower()
        if 'ai' in proj_lower:
            proj_type = 'AI / Trading Bot'
        elif 'network' in proj_lower or 'mining' in proj_lower or 'chain' in proj_lower:
            proj_type = 'Mining / Network'
        elif 'exchange' in proj_lower:
            proj_type = 'Exchange'
        elif 'defi' in proj_lower or 'protocol' in proj_lower or 'finance' in proj_lower:
            proj_type = 'DeFi / Protocol'
        elif 'nft' in proj_lower:
            proj_type = 'NFT / Earning'
        elif 'coin' in proj_lower or 'token' in proj_lower:
            proj_type = 'Token / Coin'
        else:
            proj_type = 'Crypto / Passive Income'

        projects_ws.cell(row=next_proj_row, column=1, value=next_proj_num)
        projects_ws.cell(row=next_proj_row, column=2, value=proj)
        projects_ws.cell(row=next_proj_row, column=3, value=proj_type)
        projects_ws.cell(row=next_proj_row, column=4, value=f'{count} channels (see All Bloggers)')
        projects_ws.cell(row=next_proj_row, column=5, value=count)
        projects_ws.cell(row=next_proj_row, column=6, value='-')
        projects_ws.cell(row=next_proj_row, column=7, value='Various')
        projects_ws.cell(row=next_proj_row, column=8, value='Under investigation')
        projects_ws.cell(row=next_proj_row, column=9, value='ACTIVE')
        projects_ws.cell(row=next_proj_row, column=10, value='Discovered via cross-promotional analysis')

        next_proj_row += 1
        new_projects_added += 1

    print(f"Added {new_projects_added} new projects to Projects & Network")

    # Step 6: Save
    try:
        wb.save('YouTubers_Report_v2.xlsx')
        print("\nSaved to YouTubers_Report_v2.xlsx!")
    except PermissionError:
        wb.save('YouTubers_Report_v2_fixed.xlsx')
        print("\n** File locked! Saved to YouTubers_Report_v2_fixed.xlsx **")
        print("** Close Excel and rename **")

    # Final stats
    print("\n" + "=" * 60)
    print("FINAL STATS")
    print("=" * 60)
    print(f"Contacts sheet: {contacts_ws.max_row - 1} channels")
    print(f"All Bloggers sheet: {bloggers_ws.max_row - 1} channels")
    print(f"Projects & Network: {projects_ws.max_row - 1} projects")

    # Count contacts
    emails = 0
    telegrams = 0
    instagrams = 0
    twitters = 0
    for row_idx in range(2, contacts_ws.max_row + 1):
        if contacts_ws.cell(row=row_idx, column=6).value:
            emails += 1
        if contacts_ws.cell(row=row_idx, column=7).value:
            telegrams += 1
        if contacts_ws.cell(row=row_idx, column=8).value:
            instagrams += 1
        if contacts_ws.cell(row=row_idx, column=9).value:
            twitters += 1

    print(f"\nContact coverage:")
    print(f"  Emails: {emails}")
    print(f"  Telegrams: {telegrams}")
    print(f"  Instagrams: {instagrams}")
    print(f"  Twitter/X: {twitters}")


if __name__ == '__main__':
    main()
