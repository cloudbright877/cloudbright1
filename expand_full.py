"""
Full expansion pipeline:
1. Scan reviewer channels + active promoters for new project names
2. Search YouTube for bloggers per project
3. Parse subs, contacts, country
4. Write to Contacts + All Bloggers + Projects & Network
"""
import subprocess, re, json, openpyxl, os, sys, time
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed

os.environ['PYTHONIOENCODING'] = 'utf-8'

# ── Known projects (lowercase) ──────────────────────────────────
KNOWN_PROJECTS_RAW = [
    'onpassive','wefi','treasure nft','ubit','mmmc','novanft','aurum ai',
    'uniminepool','network','interlink network','zionix global','loom x',
    'dsj exchange','spur protocol','bee network','billions network',
    'bg wealth','resonance x','alpha network','validus','ayni gold',
    'e-estate','poolpays','lev ai','sax ai','msv protocol','dore coin',
    'sprout network','bitharvest','bytnex','gidochain','novaex ai',
    'sidra chain','px network','orex network','akas dao','popmax',
    'xab club','triveni world','bitnest','swapgain','jggl',
    'orbis exchange','livegood','polkdao','perle labs','japam money',
    'welbit','nexora','rubi network','nomy finance','prime defi',
    'texit coin','starx network','kvadan token','exitus elite',
    'liquidiumx','liberlaunch labs','noah labs','veritas vault',
    'atomquant','greenco2','hash alpha','keymine','veraxis',
    'rjs capital','quantro network','bill money','very network',
    'startrader','cyrus protocol','olyone','bluelitty','kotai',
    # aliases
    'loomx','treasurenft','novanft','nova nft','star trader',
    'bit harvest','pool pays','pop max','e estate','bee coin',
]
KNOWN_PROJECTS = set(KNOWN_PROJECTS_RAW)

GENERIC = {w.lower() for w in [
    'Bitcoin','Ethereum','Solana','Cardano','XRP','BNB','Crypto','Trading',
    'Forex','DeFi','NFT','Web3','Token','Coin','Review','Scam','Legit',
    'Fake','Ponzi','Pyramid','Passive','Income','Earning','Money','Profit',
    'Cash','Investment','Invest','Withdraw','Deposit','Mining','Staking',
    'Airdrop','Wallet','Platform','App','Bot','Binance','Coinbase','Bybit',
    'OKX','KuCoin','Bitget','YouTube','Google','Facebook','Telegram',
    'Twitter','Instagram','FREE','NEW','TOP','BEST','REAL','LIVE','BIG',
    'Daily','Weekly','Monthly','Today','Now','Tutorial','Guide','Update',
    'Alert','Warning','Breaking','Affiliate','Referral','MLM','Network',
    'Marketing','The','How','What','Why','This','That','Your','Our',
    'Watch','Check','Click','Like','Share','Subscribe','NOT','STOP',
    'CAN','WILL','JUST','FROM','WITH','INTO','USDT','USDC','BTC','ETH',
    'SOL','Per','Week','Month','Year','Start','Stop','Open','Close',
    'India','Pakistan','Nigeria','Kenya','Ghana','Philippines','Indonesia',
    'Hindi','Tamil','Telugu','Urdu','English','Spanish','French',
    'Pi','Pi Network','Meme','Meme Coin','Cloud','Cloud Mining',
    'Best AI','AI Crypto','Trading Bot','Crypto Exchange',
    'Don','Does','Won','Could','Would','Should','Might',
]}

# ── Language → Country ───────────────────────────────────────────
LANG_COUNTRY = {
    'hi':'India','ta':'India','te':'India','kn':'India','ml':'India',
    'mr':'India','gu':'India','pa':'India','bn':'India/Bangladesh',
    'ur':'Pakistan','ar':'Middle East','fa':'Iran','tr':'Turkey',
    'ru':'Russia/CIS','uk':'Ukraine','pl':'Poland','ro':'Romania',
    'es':'Latin America/Spain','pt':'Brazil/Portugal','fr':'France/Africa',
    'de':'Germany','it':'Italy','nl':'Netherlands','id':'Indonesia',
    'ms':'Malaysia','tl':'Philippines','fil':'Philippines','th':'Thailand',
    'vi':'Vietnam','zh':'China','ja':'Japan','ko':'Korea','sw':'East Africa',
    'ha':'Nigeria','yo':'Nigeria','ig':'Nigeria','rw':'Rwanda','ne':'Nepal',
}
NAME_KW_COUNTRY = {
    'India':['india','hindi','भारत','हिंदी','tamil','telugu','kannada','malayalam'],
    'Pakistan':['pakistan','urdu','پاکستان'],
    'Nigeria':['nigeria','naira','naija'],
    'Philippines':['philippines','filipino','tagalog','pinoy'],
    'Indonesia':['indonesia','bahasa'],
    'Latin America':['español','latino','dinero'],
    'Russia/CIS':['русский','россия','крипто','заработок'],
    'Brazil':['brasil','português'],
    'East Africa':['swahili','kiswahili'],
    'Rwanda':['rwanda','kinyarwanda'],
    'Turkey':['türk','türkiye'],
}

# ── Reviewer channels to deep-scan ──────────────────────────────
REVIEWERS = {
    'UCr31QW9SyX7-lpPsrHZksiA': 'Jesse Singh',
    'UCOUNS8EqSZwhEHmz-T3RKvA': 'Rory Singh',
    'UCipxmR6EkmjA3Wn9tfkD6Bg': 'ScamFinder',
    'UC_afcvGtfu0TuDdfeuBvmbQ': 'Victor Isibor',
    'UCWtOcQKcrIGkCCLjqT6p70A': 'Savage Reviews',
    'UCvkaRrHbMMg8_7lUcogn6-w': 'BCryptosWorldwide',
}

# Additional YouTube searches for new project discovery
DISCOVERY_SEARCHES = [
    'crypto passive income scam review 2026',
    'new crypto MLM 2026',
    'crypto earning platform review 2026',
    'AI trading bot review 2026 scam legit',
    'crypto copy trading review 2026',
    'DeFi staking platform review 2026',
    'crypto network marketing 2026',
    'crypto arbitrage bot review 2026',
    'passive income crypto review 2026',
    'new crypto investment platform 2026',
    'crypto high yield review 2026 scam',
    'crypto HYIP review 2026',
    'crypto smart contract earning 2026',
    'crypto mining platform review 2026 legit',
    'new passive income MLM crypto',
    'crypto trading platform ponzi 2026',
    'AI crypto bot passive income 2026',
    'crypto yield farming scam 2026',
    'new crypto project review January 2026',
    'new crypto project review February 2026',
]


# ═══════════════════════════════════════════════════════════════════
#  HELPERS
# ═══════════════════════════════════════════════════════════════════

def yt(args, timeout=60):
    try:
        r = subprocess.run(
            ['python','-m','yt_dlp'] + args + ['--no-warnings','--quiet'],
            capture_output=True, text=True, encoding='utf-8', errors='replace',
            timeout=timeout)
        return r.stdout.strip()
    except:
        return ''

def get_titles(channel_id, n=50):
    out = yt([f'https://youtube.com/channel/{channel_id}/videos',
              '--flat-playlist',f'--playlist-items','1:{}'.format(n),
              '--print','%(title)s'], timeout=90)
    return [t.strip() for t in out.split('\n') if t.strip()]

def yt_search(query, n=15):
    out = yt([f'ytsearch{n}:{query}','--flat-playlist',
              '--print','%(title)s|||%(channel)s|||%(channel_id)s'], timeout=60)
    results = []
    for line in out.split('\n'):
        p = line.split('|||')
        if len(p)>=3 and p[2].strip():
            results.append({'title':p[0].strip(),'channel':p[1].strip(),'cid':p[2].strip()})
    return results

def get_subs(cid):
    out = yt([f'https://youtube.com/channel/{cid}','--playlist-items','1:1',
              '--print','%(channel_follower_count)s'], timeout=45)
    line = out.split('\n')[0].strip() if out else ''
    if line and line not in ('NA','None',''):
        try: return int(line)
        except: pass
    return 0

def get_contacts(cid):
    out = yt([f'https://youtube.com/channel/{cid}','--playlist-items','1:1',
              '--dump-single-json'], timeout=60)
    c = {'email':'','telegram':'','instagram':'','twitter':'','whatsapp':'','facebook':'','other':''}
    if not out: return c
    txt = out[:50000]
    emails = [e for e in re.findall(r'[\w.+-]+@[\w-]+\.[\w.-]+', txt)
              if not any(x in e.lower() for x in ['@youtube.','@google.','noreply','@yt.','@ytimg.','@googleapis.'])]
    if emails: c['email'] = emails[0]
    tg = re.findall(r'(?:t\.me|telegram\.me)/([a-zA-Z0-9_]+)', txt, re.I)
    if tg: c['telegram'] = f't.me/{tg[0]}'
    ig = re.findall(r'instagram\.com/([a-zA-Z0-9_.]+)', txt, re.I)
    if ig: c['instagram'] = f'instagram.com/{ig[0]}'
    tw = re.findall(r'(?:twitter\.com|x\.com)/([a-zA-Z0-9_]+)', txt, re.I)
    tw = [t for t in tw if t.lower() not in ('intent','share','home','search','i','hashtag')]
    if tw: c['twitter'] = f'x.com/{tw[0]}'
    wa = re.findall(r'(?:wa\.me|whatsapp\.com/(?:channel|send))/([a-zA-Z0-9+]+)', txt, re.I)
    if wa: c['whatsapp'] = f'wa.me/{wa[0]}'
    fb = re.findall(r'(?:facebook\.com|fb\.com)/([a-zA-Z0-9.]+)', txt, re.I)
    fb = [f for f in fb if f.lower() not in ('sharer','share','dialog','plugins','tr')]
    if fb: c['facebook'] = f'facebook.com/{fb[0]}'
    dc = re.findall(r'discord\.gg/([a-zA-Z0-9]+)', txt, re.I)
    if dc: c['other'] = f'discord.gg/{dc[0]}'
    return c

def get_country(cid):
    out = yt([f'https://youtube.com/channel/{cid}','--playlist-items','1:1',
              '--print','%(language)s|||%(channel)s|||%(title)s|||%(description).300s'], timeout=45)
    p = out.split('|||') if out else []
    lang = p[0].strip() if p else ''
    text = ' '.join(p[1:]).lower() if len(p)>1 else ''
    if lang and lang != 'NA' and lang in LANG_COUNTRY:
        return LANG_COUNTRY[lang]
    for country, kws in NAME_KW_COUNTRY.items():
        for kw in kws:
            if kw in text: return country
    if any('\u0900'<=c<='\u097F' for c in text): return 'India'
    if any('\u0600'<=c<='\u06FF' for c in text): return 'Pakistan/Middle East'
    if any('\u0400'<=c<='\u04FF' for c in text): return 'Russia/CIS'
    return ''

def extract_projects(titles):
    found = Counter()
    pats = [
        r'(?:^|\s|\||\-|:)([A-Z][a-zA-Z0-9]+(?:[\s\-](?:AI|Pro|Plus|Max|Labs|Finance|Protocol|Network|Club|DAO|DeFi|Vault|Exchange|Capital|Token|Earn|Pay|Mining|Trade|Trader|Bot|Fund|Invest|Wealth|Tech|Global|World|Group|Elite|Prime|Alpha|Crypto|Digital|Smart|Bit|Hash|Node|Apex|Nexus|Matrix|Nova|Pulse|Core|Hub|One|X|IO|Gold|Coin|Chain|Swap|Pool|Flux|Bridge|Gate|Zone)){1,2})(?:\s|\||$|\.|\!|\?|,|\-|:)',
        r'[Ii]s\s+([A-Z][a-zA-Z0-9]+(?:\s[A-Z][a-zA-Z0-9]+){0,2})\s+(?:legit|a?\s*scam|real|fake|worth|paying|safe)',
        r'(?:^|\s)([A-Z][a-zA-Z0-9]{2,}(?:\s[A-Z][a-zA-Z0-9]{2,}){0,2})\s+(?:review|scam|legit|withdrawal|earning|tutorial|update|launch|staking|mining)',
    ]
    for title in titles:
        for pat in pats:
            for m in re.finditer(pat, title):
                name = m.group(1).strip()
                if len(name)<3 or len(name)>30: continue
                if name.lower() in KNOWN_PROJECTS: continue
                if name.lower() in GENERIC: continue
                words = name.split()
                if all(w.lower() in GENERIC for w in words): continue
                if len(words)==1 and words[0].lower() in GENERIC: continue
                found[name] += 1
    return found

def quality(contacts):
    s = 0
    if contacts['email']: s+=3
    if contacts['telegram']: s+=2
    if contacts['instagram']: s+=1
    if contacts['twitter']: s+=1
    if contacts['whatsapp']: s+=1
    if contacts['facebook']: s+=1
    if s>=4: return 'HIGH'
    if s>=2: return 'MEDIUM'
    if s>=1: return 'LOW'
    return 'NONE'


# ═══════════════════════════════════════════════════════════════════
#  PHASE 1 — DISCOVER NEW PROJECTS
# ═══════════════════════════════════════════════════════════════════

def phase1_discover():
    print("="*60)
    print("PHASE 1: Discovering new projects")
    print("="*60)

    all_found = Counter()
    proj_sources = defaultdict(list)

    # 1a. Deep-scan reviewer channels
    print("\n[1a] Scanning reviewer channels...")
    for cid, name in REVIEWERS.items():
        titles = get_titles(cid, n=80)
        print(f"  {name}: {len(titles)} titles")
        projs = extract_projects(titles)
        for p, c in projs.items():
            all_found[p] += c
            proj_sources[p].append(name)

    # 1b. YouTube search for new platforms
    print("\n[1b] Broad YouTube search...")
    for q in DISCOVERY_SEARCHES:
        results = yt_search(q, n=20)
        for r in results:
            projs = extract_projects([r['title']])
            for p, c in projs.items():
                all_found[p] += c
                proj_sources[p].append(r['channel'])

    # Filter: keep projects mentioned by 2+ unique sources OR 3+ total mentions
    new_projects = []
    print("\n" + "="*60)
    print("DISCOVERED PROJECTS:")
    print("="*60)
    for proj, count in all_found.most_common(60):
        sources = list(set(proj_sources[proj]))
        if len(sources) >= 2 or count >= 3:
            print(f"  {count:>3}x, {len(sources)} sources | {proj:25s} <- {', '.join(sources[:3])}")
            new_projects.append(proj)

    # Manual filter — remove obvious generic terms
    generic_filter = {'Pi Network','Meme Coin','Cloud Mining','Best AI','AI Crypto',
                      'Trading Bot','Crypto Exchange','Best AI Crypto','To Earn',
                      'Pi Coin','Level AI','First AI','The AI','Next Crypto',
                      'Best Crypto','Your Crypto','This Crypto','My Crypto',
                      'For Crypto','With Crypto','NEW AI','Earn Crypto',
                      'To Invest','More Crypto','Real World','No One',
                      'Gold Mining','Send Crypto','How AI','Privacy Coin',
                      'New DeFi','This DeFi','Stake Crypto','P2P Crypto',
                      'Simple Earn','This AI','ROI Crypto','Banana Pro',
                      'Binance Alpha','Hidden','Scam','Support','Review',
                      'Pen','Movie','Hack','Formula','Code','Method',
                      'Box','Patch','Inflator','Drops','Fake','Years',
                      'Tinnitus','FCA','Interlink Mining','No One','Best Crypto Exchange',
                      'Interlink Coin','Interlink Labs','Friendly Crypto','On Crypto',
                      'Fairest Crypto','Sports Token','In Crypto','Next Crypto',
                      'Best AI','Big AI','Copy Trade','Pepe Coin',
                      }
    new_projects = [p for p in new_projects if p not in generic_filter]

    print(f"\nFiltered to {len(new_projects)} real projects: {new_projects[:15]}")
    return new_projects


# ═══════════════════════════════════════════════════════════════════
#  PHASE 2 — FIND BLOGGERS + PARSE ALL INFO
# ═══════════════════════════════════════════════════════════════════

def phase2_find_bloggers(new_projects, existing_names, existing_ids):
    print("\n" + "="*60)
    print("PHASE 2: Finding & enriching bloggers")
    print("="*60)

    all_new_channels = []  # list of dicts

    for proj in new_projects:
        print(f"\n--- {proj} ---")
        queries = [
            f'{proj} review',
            f'{proj} crypto review',
            f'{proj} earning',
            f'{proj} scam or legit',
        ]

        channels = {}
        for q in queries:
            for r in yt_search(q, n=12):
                cid = r['cid']
                if cid and cid not in channels:
                    channels[cid] = r

        # Filter existing
        new_ch = {cid: info for cid, info in channels.items()
                  if cid not in existing_ids and info['channel'].strip().lower() not in existing_names}

        print(f"  Found {len(channels)}, new: {len(new_ch)}")
        if not new_ch:
            continue

        # Get subs + contacts + country (parallel, top 10)
        ch_list = list(new_ch.values())[:10]

        def enrich(info):
            cid = info['cid']
            subs = get_subs(cid)
            if subs > 500000:  # skip mainstream
                return None
            contacts = get_contacts(cid)
            country = get_country(cid)
            return {
                'name': info['channel'],
                'cid': cid,
                'subs': subs,
                'project': proj,
                'country': country,
                'contacts': contacts,
            }

        with ThreadPoolExecutor(max_workers=3) as ex:
            futs = [ex.submit(enrich, info) for info in ch_list]
            for f in as_completed(futs):
                result = f.result()
                if result and result['name'] and result['name'] != 'NA':
                    ch_name_lower = result['name'].strip().lower()
                    if ch_name_lower not in existing_names and result['cid'] not in existing_ids:
                        all_new_channels.append(result)
                        existing_names.add(ch_name_lower)
                        existing_ids.add(result['cid'])
                        subs_str = f"{result['subs']:,}" if result['subs'] else 'N/A'
                        email_flag = ' [E]' if result['contacts']['email'] else ''
                        tg_flag = ' [T]' if result['contacts']['telegram'] else ''
                        print(f"    + {subs_str:>10} | {result['name'][:35]:35s} | {result['country'][:15]}{email_flag}{tg_flag}")

    return all_new_channels


# ═══════════════════════════════════════════════════════════════════
#  PHASE 3 — WRITE TO EXCEL
# ═══════════════════════════════════════════════════════════════════

def phase3_write(new_channels):
    print("\n" + "="*60)
    print(f"PHASE 3: Writing {len(new_channels)} channels to Excel")
    print("="*60)

    wb = openpyxl.load_workbook('YouTubers_Report_v2.xlsx')
    contacts_ws = wb['Contacts']
    bloggers_ws = wb['All Bloggers']
    projects_ws = wb['Projects & Network']

    # Current max rows
    c_row = contacts_ws.max_row + 1
    c_num = contacts_ws.max_row
    b_row = bloggers_ws.max_row + 1
    b_num = bloggers_ws.max_row

    # Existing bloggers names for dedup
    existing_bloggers = set()
    for r in range(2, bloggers_ws.max_row + 1):
        n = bloggers_ws.cell(row=r, column=2).value
        if n: existing_bloggers.add(n.strip().lower())

    added_contacts = 0
    added_bloggers = 0
    new_project_names = set()

    for ch in new_channels:
        subs_str = f"{ch['subs']:,}" if ch['subs'] else 'N/A'
        ct = ch['contacts']
        q = quality(ct)
        url = f"youtube.com/channel/{ch['cid']}"

        # ── Contacts sheet ──
        c_num += 1
        contacts_ws.cell(row=c_row, column=1, value=c_num)
        contacts_ws.cell(row=c_row, column=2, value=ch['name'])
        contacts_ws.cell(row=c_row, column=3, value=subs_str)
        contacts_ws.cell(row=c_row, column=4, value=ch['project'])
        contacts_ws.cell(row=c_row, column=5, value=ch['country'])
        contacts_ws.cell(row=c_row, column=6, value=ct['email'])
        contacts_ws.cell(row=c_row, column=7, value=ct['telegram'])
        contacts_ws.cell(row=c_row, column=8, value=ct['instagram'])
        contacts_ws.cell(row=c_row, column=9, value=ct['twitter'])
        contacts_ws.cell(row=c_row, column=10, value=ct['whatsapp'])
        contacts_ws.cell(row=c_row, column=11, value=ct['facebook'])
        contacts_ws.cell(row=c_row, column=12, value=ct['other'])
        contacts_ws.cell(row=c_row, column=13, value=q)
        contacts_ws.cell(row=c_row, column=14, value=url)
        c_row += 1
        added_contacts += 1

        # ── All Bloggers sheet ──
        if ch['name'].strip().lower() not in existing_bloggers:
            try:
                subs_num = ch['subs']
            except:
                subs_num = 0
            if subs_num >= 100000: qual = 'HIGH'
            elif subs_num >= 10000: qual = 'MEDIUM'
            elif subs_num >= 1000: qual = 'LOW'
            else: qual = 'MICRO'

            b_num += 1
            bloggers_ws.cell(row=b_row, column=1, value=b_num)
            bloggers_ws.cell(row=b_row, column=2, value=ch['name'])
            bloggers_ws.cell(row=b_row, column=3, value=subs_str)
            bloggers_ws.cell(row=b_row, column=4, value=url)
            bloggers_ws.cell(row=b_row, column=5, value=ch['project'])
            bloggers_ws.cell(row=b_row, column=6, value=ch['country'])
            bloggers_ws.cell(row=b_row, column=7, value='Crypto / Passive Income')
            bloggers_ws.cell(row=b_row, column=8, value=f"{ch['project']} coverage")
            bloggers_ws.cell(row=b_row, column=9, value=qual)
            bloggers_ws.cell(row=b_row, column=10, value='MEDIUM')
            b_row += 1
            added_bloggers += 1
            existing_bloggers.add(ch['name'].strip().lower())

        new_project_names.add(ch['project'])

    # ── Projects & Network sheet — add new projects ──
    existing_proj = set()
    for r in range(2, projects_ws.max_row + 1):
        p = projects_ws.cell(row=r, column=2).value
        if p: existing_proj.add(p.strip())

    # Count per project
    proj_counts = Counter()
    for r in range(2, contacts_ws.max_row + 1):
        p = contacts_ws.cell(row=r, column=4).value
        if p: proj_counts[p] += 1

    p_row = projects_ws.max_row + 1
    p_num = projects_ws.max_row
    added_projects = 0
    for proj in new_project_names:
        if proj in existing_proj:
            # Update count
            for r in range(2, projects_ws.max_row + 1):
                if projects_ws.cell(row=r, column=2).value == proj:
                    cnt = proj_counts.get(proj, 0)
                    projects_ws.cell(row=r, column=4, value=f'{cnt} channels')
                    projects_ws.cell(row=r, column=5, value=cnt)
                    break
            continue

        cnt = proj_counts.get(proj, 0)
        pl = proj.lower()
        if 'ai' in pl: ptype = 'AI / Trading Bot'
        elif 'network' in pl or 'mining' in pl or 'chain' in pl: ptype = 'Mining / Network'
        elif 'exchange' in pl: ptype = 'Exchange'
        elif 'defi' in pl or 'protocol' in pl or 'finance' in pl: ptype = 'DeFi / Protocol'
        elif 'coin' in pl or 'token' in pl: ptype = 'Token / Coin'
        else: ptype = 'Crypto / Passive Income'

        p_num += 1
        projects_ws.cell(row=p_row, column=1, value=p_num)
        projects_ws.cell(row=p_row, column=2, value=proj)
        projects_ws.cell(row=p_row, column=3, value=ptype)
        projects_ws.cell(row=p_row, column=4, value=f'{cnt} channels')
        projects_ws.cell(row=p_row, column=5, value=cnt)
        projects_ws.cell(row=p_row, column=6, value='-')
        projects_ws.cell(row=p_row, column=7, value='Various')
        projects_ws.cell(row=p_row, column=8, value='Under investigation')
        projects_ws.cell(row=p_row, column=9, value='ACTIVE')
        projects_ws.cell(row=p_row, column=10, value='Discovered via cross-promo analysis')
        p_row += 1
        added_projects += 1

    # Save
    try:
        wb.save('YouTubers_Report_v2.xlsx')
        print("Saved!")
    except PermissionError:
        wb.save('YouTubers_Report_v2_new.xlsx')
        print("** Locked! Saved to YouTubers_Report_v2_new.xlsx **")

    print(f"\nContacts sheet: +{added_contacts} → {c_num} total")
    print(f"All Bloggers: +{added_bloggers} → {b_num} total")
    print(f"Projects: +{added_projects} new")

    # Stats
    emails = tg = ig = tw = ctry = 0
    for r in range(2, contacts_ws.max_row + 1):
        if contacts_ws.cell(row=r, column=6).value: emails += 1
        if contacts_ws.cell(row=r, column=7).value: tg += 1
        if contacts_ws.cell(row=r, column=8).value: ig += 1
        if contacts_ws.cell(row=r, column=9).value: tw += 1
        if contacts_ws.cell(row=r, column=5).value: ctry += 1

    print(f"\nContacts coverage: emails={emails}, telegram={tg}, instagram={ig}, twitter={tw}")
    print(f"Country coverage: {ctry}/{c_num}")


# ═══════════════════════════════════════════════════════════════════
#  MAIN
# ═══════════════════════════════════════════════════════════════════

def main():
    # Load existing data
    wb = openpyxl.load_workbook('YouTubers_Report_v2.xlsx')
    ws = wb['Contacts']
    existing_names = set()
    existing_ids = set()
    for r in range(2, ws.max_row + 1):
        n = ws.cell(row=r, column=2).value
        u = ws.cell(row=r, column=14).value
        if n: existing_names.add(n.strip().lower())
        if u:
            m = re.search(r'UC[\w-]{22}', str(u))
            if m: existing_ids.add(m.group())
    wb.close()

    print(f"Starting with {len(existing_names)} channels, {len(existing_ids)} IDs\n")

    # Phase 1
    new_projects = phase1_discover()

    if not new_projects:
        print("\nNo new projects found.")
        return

    # Phase 2
    new_channels = phase2_find_bloggers(new_projects, existing_names, existing_ids)

    if not new_channels:
        print("\nNo new channels found.")
        return

    # Phase 3
    phase3_write(new_channels)

    print("\n" + "="*60)
    print("DONE!")
    print("="*60)


if __name__ == '__main__':
    main()
