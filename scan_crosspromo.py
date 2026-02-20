"""
Cross-promotional scan: find new projects from existing bloggers' video titles,
then search for bloggers promoting those new projects.
"""
import subprocess, re, json, openpyxl, sys, os, time
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed

os.environ['PYTHONIOENCODING'] = 'utf-8'

# All known projects (lowercase) - skip these
KNOWN_PROJECTS = {
    'treasure nft', 'treasurenft', 'uniminepool', 'unimine', 'network',
    'wefi', 'we fi', 'onpassive', 'on passive', 'novanft', 'nova nft',
    'ubit', 'mmmc', 'ultraverse', 'validus', 'startrader', 'star trader',
    'aurum ai', 'aurumi', 'hash alpha', 'cyrus finance', 'cyrus protocol',
    'cyrusprotocol', 'weex', 'weex exchange', 'veritas vault', 'vva',
    'xab club', 'xab', 'bitharvest', 'bit harvest', 'popmax', 'pop max',
    'olyone', 'oly one', 'olyone defi', 'noah labs', 'exitus elite', 'exitus',
    'quantro', 'quantro network', 'akas dao', 'akasdao', 'poolpays', 'pool pays',
    'e-estate', 'eestate', 'e estate',
}

# Generic words to skip
GENERIC = {w.lower() for w in [
    'The', 'How', 'What', 'Why', 'Best', 'Top', 'New', 'Free', 'Live', 'Join',
    'This', 'That', 'Your', 'Our', 'Big', 'Real', 'Full', 'Day', 'All', 'Get',
    'Now', 'See', 'Let', 'Use', 'Watch', 'Check', 'Click', 'Like', 'Share',
    'Subscribe', 'Warning', 'Alert', 'Breaking', 'Update', 'Urgent', 'Official',
    'Review', 'Proof', 'Earn', 'Make', 'Money', 'Income', 'Profit', 'Cash',
    'Dollar', 'Daily', 'Monthly', 'Weekly', 'Crypto', 'Bitcoin', 'Ethereum',
    'Trading', 'Forex', 'Stock', 'Market', 'Price', 'NOT', 'STOP', 'DONT',
    'CAN', 'WILL', 'MUST', 'JUST', 'HERE', 'THERE', 'BACK', 'OVER', 'FROM',
    'WITH', 'INTO', 'VERY', 'MUCH', 'THAN', 'THEN', 'ONLY', 'ALSO', 'EVEN',
    'STILL', 'YES', 'Revealed', 'Secret', 'Truth', 'Passive', 'Active',
    'Online', 'Digital', 'Smart', 'Global', 'World', 'Scam', 'Legit', 'Fake',
    'Ponzi', 'Pyramid', 'Token', 'Coin', 'Chain', 'Blockchain', 'Mining',
    'Staking', 'Airdrop', 'Wallet', 'Platform', 'App', 'Site', 'Website',
    'Today', 'Tonight', 'Tomorrow', 'Yesterday', 'Part', 'Episode', 'Video',
    'Channel', 'Hindi', 'English', 'Tamil', 'Telugu', 'Urdu', 'Bangla',
    'Malayalam', 'Kannada', 'Marathi', 'Gujarati', 'Punjabi', 'Arabic',
    'Spanish', 'French', 'German', 'Russian', 'Chinese', 'Japanese', 'Korean',
    'Indonesian', 'Filipino', 'Thai', 'Vietnamese', 'Turkish', 'Portuguese',
    'Italian', 'Polish', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish',
    'Paying', 'Payment', 'Withdraw', 'Deposit', 'Signup', 'Register',
    'Login', 'Account', 'Investment', 'Invest', 'Investor', 'Return',
    'Strategy', 'Plan', 'System', 'Program', 'Project', 'Company',
    'Business', 'Work', 'Job', 'Career', 'Side', 'Hustle', 'Opportunity',
    'Chance', 'Deal', 'Offer', 'Bonus', 'Reward', 'Gift', 'Giveaway',
    'Contest', 'Winners', 'Results', 'Proof', 'Evidence', 'Exposed',
    'Honest', 'Unbiased', 'Detailed', 'Complete', 'Ultimate', 'Guide',
    'Tutorial', 'Step', 'Simple', 'Easy', 'Fast', 'Quick', 'Instant',
    'Guaranteed', 'Proven', 'Tested', 'Real', 'Genuine', 'SHOCKING',
    'INSANE', 'CRAZY', 'HUGE', 'MASSIVE', 'GAME', 'CHANGER', 'FINALLY',
    'BREAKING', 'IMPORTANT', 'NEWS', 'LATEST', 'MAJOR', 'BIG', 'NEW',
    'Referral', 'Affiliate', 'Network', 'Marketing', 'MLM', 'Commission',
    'Autopilot', 'Residual', 'Recurring', 'Freedom', 'Lifestyle',
    'India', 'Pakistan', 'Nigeria', 'Kenya', 'Ghana', 'Philippines',
    'Indonesia', 'Bangladesh', 'Nepal', 'SriLanka',
    'YouTube', 'Google', 'Facebook', 'Instagram', 'Twitter', 'TikTok',
    'Telegram', 'WhatsApp', 'Discord', 'Reddit', 'LinkedIn',
    'Binance', 'Coinbase', 'Bybit', 'OKX', 'KuCoin', 'Bitget',
    'Solana', 'Cardano', 'Polkadot', 'Avalanche', 'Polygon', 'Arbitrum',
    'Don', 'Does', 'Doesn', 'Won', 'Isn', 'Aren', 'Hasn', 'Haven',
    'Could', 'Would', 'Should', 'Might', 'Right', 'Wrong', 'True', 'False',
    'USDT', 'USDC', 'BTC', 'ETH', 'SOL', 'ADA', 'XRP', 'BNB', 'DOGE',
    'Per', 'Week', 'Month', 'Year', 'Hour', 'Minute', 'Second',
    'Start', 'Stop', 'Open', 'Close', 'Run', 'Build', 'Create',
    'Look', 'Find', 'Know', 'Think', 'Want', 'Need', 'Try', 'Help',
    'Show', 'Tell', 'Give', 'Take', 'Come', 'Call', 'Ask', 'Pay',
    'Win', 'Lose', 'Lost', 'Gain', 'Grow', 'Rise', 'Fall', 'Drop',
    'Pump', 'Dump', 'Bull', 'Bear', 'Moon', 'Dip', 'ATH', 'ATL',
    'Crash', 'Surge', 'Rally', 'Peak', 'Bottom', 'Floor', 'Ceiling',
]}

def get_channel_videos(channel_url, max_videos=30):
    """Get recent video titles from a channel using yt-dlp"""
    try:
        url = channel_url.rstrip('/')
        if not url.startswith('http'):
            url = 'https://' + url
        r = subprocess.run(
            ['python', '-m', 'yt_dlp',
             f'{url}/videos',
             '--flat-playlist', '--playlist-items', f'1:{max_videos}',
             '--print', '%(title)s',
             '--no-warnings', '--quiet'],
            capture_output=True, text=True, encoding='utf-8', errors='replace',
            timeout=60
        )
        titles = [t.strip() for t in r.stdout.strip().split('\n') if t.strip()]
        return titles
    except Exception as e:
        return []

def extract_projects(titles):
    """Extract potential project names from video titles"""
    found = Counter()
    patterns = [
        # "ProjectName Review/Scam/Legit/Withdrawal etc"
        r'(?:^|\s|\||\-|:)([A-Z][a-zA-Z0-9]+(?:\s(?:AI|Pro|Plus|Max|Labs|Finance|Protocol|Network|Club|DAO|DeFi|Vault|Exchange|Capital|Chain|Coin|Token|Earn|Pay|Mining|Stake|Trade|Trader|Bot|Fund|Invest|Wealth|Cash|Money|Gold|Silver|Tech|Global|World|Group|Elite|Prime|Alpha|Beta|Omega|Crypto|Digital|Meta|Verse|Block|Smart|Auto|Bit|Hash|Node|Web|Cloud|Data|Cyber|Quantum|Solar|Lunar|Astro|Cosmo|Apex|Zenith|Nexus|Vertex|Matrix|Helix|Flux|Nova|Orbit|Pulse|Spark|Blaze|Storm|Thunder|Forge|Core|Link|Sync|Flow|Wave|Stream|Bridge|Gate|Hub|Zone|Sphere|Realm|Domain|One|X|IO|XYZ)){1,2})(?:\s|\||$|\.|\!|\?|,|\-|:)',
        # "Is ProjectName a scam/legit"
        r'[Ii]s\s+([A-Z][a-zA-Z0-9]+(?:\s[A-Z][a-zA-Z0-9]+){0,2})\s+(?:legit|a?\s*scam|real|fake|worth|paying|safe)',
        # Project + review/tutorial/earning
        r'(?:^|\s)([A-Z][a-zA-Z0-9]{2,}(?:\s[A-Z][a-zA-Z0-9]{2,}){0,2})\s+(?:review|scam|legit|withdrawal|deposit|earning|tutorial|update|launch|staking|mining|airdrop|signup|register)',
    ]

    for title in titles:
        for pat in patterns:
            for m in re.finditer(pat, title):
                name = m.group(1).strip()
                # Cleanup
                if len(name) < 3 or len(name) > 30:
                    continue
                if name.lower() in KNOWN_PROJECTS:
                    continue
                if name.lower() in GENERIC:
                    continue
                # Skip if all words are generic
                words = name.split()
                if all(w.lower() in GENERIC for w in words):
                    continue
                # Skip if starts with generic
                if words[0].lower() in GENERIC and len(words) == 1:
                    continue
                found[name] += 1
    return found

def scan_channel(args):
    """Scan a channel and return results"""
    name, url, project, subs = args
    titles = get_channel_videos(url)
    projects = extract_projects(titles)
    return name, project, subs, titles, projects


def main():
    print("=" * 60)
    print("PHASE 1: Scanning existing channels for new projects")
    print("=" * 60)

    # Load existing data
    wb = openpyxl.load_workbook('YouTubers_Report_v2.xlsx')
    ws = wb.active

    existing_names = set()
    existing_ids = set()
    targets = []

    for row in ws.iter_rows(min_row=2, values_only=False):
        name = row[1].value  # B = Channel Name
        subs_str = row[2].value  # C = Subscribers
        project = row[3].value  # D = Category/Project
        url = row[13].value if len(row) > 13 else None  # N = YouTube URL

        if name:
            existing_names.add(name.strip().lower())
        if url:
            # Extract channel ID from URL
            m = re.search(r'UC[\w-]{22}', str(url))
            if m:
                existing_ids.add(m.group())

        if not name or not url or not project:
            continue

        try:
            subs = int(str(subs_str).replace(',', '').replace(' ', ''))
        except:
            subs = 0

        # Skip OnPassive channels (too many, mostly not cross-promoters)
        # Skip official project channels
        if 'ONPASSIVE' == name or 'onpassive' in name.lower():
            continue

        # Focus on channels that are likely multi-project promoters
        # Higher sub channels from newer/smaller projects
        if project in ('Aurum AI', 'BitHarvest', 'E-Estate', 'PoolPays', 'Akas Dao',
                       'XAB Club', 'Exitus Elite', 'Veritas Vault', 'PopMax',
                       'Quantro Network', 'Noah Labs', 'Hash Alpha', 'Cyrus Protocol'):
            targets.append((name, url, project, subs))
        elif project in ('Validus', 'UBIT/MMMC', 'NovaNFT', 'Uniminepool') and subs >= 3000:
            targets.append((name, url, project, subs))
        elif project in ('WeFi', 'Network') and subs >= 10000:
            targets.append((name, url, project, subs))
        elif project == 'Treasure NFT' and subs >= 30000:
            targets.append((name, url, project, subs))

    # Sort by subs, take top 60
    targets.sort(key=lambda x: -x[3])
    targets = targets[:60]

    print(f"Existing: {len(existing_names)} names, {len(existing_ids)} IDs")
    print(f"Scanning {len(targets)} channels for cross-promotions...\n")

    # Parallel scan
    all_found = Counter()
    project_channels = defaultdict(list)  # new_project -> [(channel_name, original_project)]
    all_titles = {}  # channel -> titles (for debug)

    with ThreadPoolExecutor(max_workers=5) as ex:
        futures = {ex.submit(scan_channel, t): t for t in targets}
        done = 0
        for f in as_completed(futures):
            done += 1
            name, orig_project, subs, titles, found_projects = f.result()

            status = f"[{done:2d}/{len(targets)}] {name[:35]:35s} ({orig_project}): {len(titles)} videos"
            if found_projects:
                top3 = [f"{p}({c})" for p, c in found_projects.most_common(3)]
                status += f" -> {', '.join(top3)}"
            print(status)

            all_titles[name] = titles
            for proj, cnt in found_projects.items():
                all_found[proj] += cnt
                project_channels[proj].append((name, orig_project, subs))

    # Filter: keep projects mentioned by 2+ different channels
    print("\n" + "=" * 60)
    print("DISCOVERED NEW PROJECTS (mentioned by 2+ channels):")
    print("=" * 60)

    new_projects = []
    for proj, count in all_found.most_common(50):
        channels = project_channels[proj]
        unique_channels = len(set(ch[0] for ch in channels))
        if unique_channels >= 2:
            ch_str = ", ".join([f"{n} ({c})" for n, c, s in channels[:4]])
            print(f"  {unique_channels:>2} channels, {count:>3} mentions | {proj:30s} <- {ch_str}")
            new_projects.append(proj)

    print(f"\n\nAll single mentions:")
    for proj, count in all_found.most_common(100):
        channels = project_channels[proj]
        unique_channels = len(set(ch[0] for ch in channels))
        if unique_channels == 1:
            ch = channels[0]
            print(f"  1x | {proj:30s} <- {ch[0]} ({ch[1]})")

    print(f"\n\nTotal new projects found: {len(new_projects)} (with 2+ channel mentions)")
    print(f"Projects to search: {new_projects[:20]}")

    # Save results for phase 2
    with open('discovered_projects.json', 'w', encoding='utf-8') as f:
        json.dump({
            'new_projects': new_projects,
            'project_channels': {k: v for k, v in project_channels.items()},
            'existing_names': list(existing_names)[:50],  # sample
            'existing_ids': list(existing_ids),
        }, f, ensure_ascii=False, indent=2, default=str)

    print(f"\nSaved to discovered_projects.json")
    print("Run phase 2 to search for bloggers promoting these new projects.")


if __name__ == '__main__':
    main()
