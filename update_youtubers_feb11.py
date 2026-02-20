"""
Update YouTubers_Report_v2_CLEANED.xlsx - Feb 11, 2026
- Add new channels from Aurum AI, BitHarvest, MLM, passive income searches
- Update existing channels with newly found Telegram contacts
- Remove duplicates
- Re-sort by category
"""
import openpyxl
import re
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

# ============================================================
# 1. TELEGRAM & CONTACT UPDATES for existing channels
# ============================================================
CONTACT_UPDATES = {
    'ComPho Crypto': {
        'Telegram': 't.me/comphocryptobitcoin',
        'Contact Quality': 'MEDIUM',
    },
    'DIGITEX': {
        'Telegram': 't.me/digitexupdates',
        'Contact Quality': 'MEDIUM',
    },
    'DANNY DE HEK': {
        'Telegram': 't.me/PonziSchemeAvenger',
        'Other': 'dehek.com, dehek.substack.com, links.dehek.com, Podcast: podcast.dehek.com',
        'Contact Quality': 'HIGH',
        'Country': 'New Zealand',
        'Notes': 'Known as "The Crypto Ponzi Scheme Avenger" (NYT). Exposes crypto scams. Wikipedia page. 66K subs.',
    },
    'Leaders Road': {
        'Telegram': 't.me/leadersroad',
        'Other': 'linktr.ee/leadersroadpro, TG DM: @Will_The_Leader',
        'Category': 'Uniminepool',
        'Contact Quality': 'HIGH',
        'Notes': 'Run by Will. Automation, AI tools, passive income. 3 Unimine videos. Also runs Spanish channel La Ruta Lider.',
    },
    'The Perfect Wealth': {
        'Other': 'ThePerfectWealth.com, facebook.com/groups/theperfectwealth',
        'Category': 'Uniminepool',
        'Contact Quality': 'MEDIUM',
        'Notes': 'Passive income programs. Facebook group is main community. Unimine "Exposed" video.',
    },
    'Crypto Primetime': {
        'Other': 'linktr.ee/CryptoPrimeTime',
        'Notes': 'One Stop Shop for crypto. Has Unimine live deposit video. Check Linktree for contacts.',
    },
    'Creative Life Freedom': {
        'Other': 'creativefreedomlifestyle.com',
        'Notes': 'Run by Christy Darlington. Passive income entrepreneur. 2 Unimine videos.',
    },
    'ONLINE PASSIVE AND ACTIVE INCOME': {
        'Telegram': 't.me/easypassiveincomes',
        'Other': 'TG DM: t.me/lifeiseasyforever, t.me/passiveluxary',
        'Contact Quality': 'HIGH',
        'Notes': '3 Unimine videos (2026). Brand "Easy Passive Incomes". Multiple TG links.',
    },
    'Alex Zubarev (Alex Z)': {
        'Instagram': 'instagram.com/alexzubarev',
        'Other': 'tiktok.com/@alexzubarev1 (300K followers), facebook.com/AlexZubarev, alexzubarev.me',
        'Contact Quality': 'MEDIUM',
        'Notes': 'NYC. Serial entrepreneur. Also promoted BitHarvest. TikTok 300K followers. 7-figure earner network marketing.',
    },
    'Jesse Singh': {
        'Other': 'jessesingh.org',
        'Category': 'Aurum AI',
        'Notes': 'Canada. Internet marketer 5+ years. Reviewed Aurum AI (called it Ponzi). Also reviewed other schemes.',
    },
    'Rory Singh': {
        'Twitter/X': 'x.com/rorysingh1',
        'Other': 'rorysinghreviews.com, rorysinghreviews.org',
        'Contact Quality': 'MEDIUM',
        'Country': 'Canada',
        'Notes': 'Ontario, Canada. Former truck driver. Critical reviewer. Reviewed BitHarvest (exposed CEO as Steve Ng). 17.2K subs.',
    },
    'Crypto Pays Me Daily': {
        'Category': 'MLM Promoter',
        'Contact Quality': 'MEDIUM',
        'Notes': 'Quentin Bradford. One of most prolific MLM crypto promoters. Promoted GETFIT, Fintoch, PLC Ultima, Paraiba, '
                 'MetaFi, Intelligence Prime Capital, 20+ collapsed schemes. TG group "Game Plan to 100 Grand".',
    },
    'ScamFinder': {
        'Twitter/X': 'x.com/ScamFinder13',
        'Other': 'scamfinder.net',
        'Contact Quality': 'MEDIUM',
        'Notes': 'Publishes crypto scam reviews. BitHarvest review site. 29.3K subs.',
    },
}

# ============================================================
# 2. NEW CHANNELS TO ADD
# ============================================================
NEW_CHANNELS = [
    # --- Aurum AI ---
    {
        'Channel Name': 'Paul Hardingham',
        'Subscribers': '24,100',
        'YouTube URL': 'https://youtube.com/@paulhardingham',
        'Category': 'Aurum AI',
        'Country': 'UK',
        'Niche': 'Crypto / Scam Review',
        'Quality': 'HIGH',
        'Fake Risk': 'LOW',
        'Upload Freq': 'Regular',
        'Email': 'youtube@ynopp.com',
        'Telegram': 't.me/paulhardingham',
        'Instagram': 'instagram.com/paulhardingham',
        'Twitter/X': 'x.com/paulhardingham1',
        'Other': 'paulhardingham.com, Skype: paulhardingham, CEO of VC Crowd, ADNET Multimedia founder',
        'Contact Quality': 'HIGH',
        'Role': 'Critical Reviewer',
        'Notes': 'Angel investor, Bitcoin holder since 2015. Aurum Foundation scam review comparing to CashFX. Best contact info.',
        'Verdict': 'MAYBE',
        'Verdict Reason': 'Critical reviewer (24K subs). High credibility, excellent contacts. Not a promoter but could be partner for honest reviews.',
    },
    {
        'Channel Name': 'Cryptozoa (Patrick)',
        'Subscribers': '7,000',
        'YouTube URL': 'https://youtube.com/@cryptozoa',
        'Category': 'Aurum AI',
        'Country': 'USA',
        'Niche': 'Crypto / AI Trading',
        'Quality': 'MEDIUM',
        'Fake Risk': 'MEDIUM',
        'Upload Freq': 'Regular',
        'Telegram': 't.me/joinchat/PbTulqLoCmAzZmQx',
        'Twitter/X': 'x.com/TheCryptozoa',
        'Other': 'cryptozoa.medium.com (7K followers), cryptozoa.com',
        'Contact Quality': 'HIGH',
        'Role': 'Active Promoter',
        'Notes': 'Most prolific Aurum content creator. Medium Top 1000 writer. Tests bot with real money ($180 to $1210 in 56 days). TG group is best contact.',
        'Verdict': 'MAYBE',
        'Verdict Reason': 'Active Aurum promoter. Primarily Medium-based but has TG group. Tests with real money. Good for partnership.',
    },
    # --- BitHarvest ---
    {
        'Channel Name': 'Marcos Caleb (MyBTCMovement)',
        'Subscribers': '3,100',
        'YouTube URL': 'https://youtube.com/@marcoscaleb',
        'Category': 'BitHarvest',
        'Country': 'UK',
        'Niche': 'Crypto / MLM',
        'Quality': 'LOW',
        'Fake Risk': 'HIGH',
        'Upload Freq': 'Deleted',
        'Telegram': 't.me/marcoscaleb',
        'Twitter/X': 'x.com/mybtcmovement',
        'Other': 'linkedin.com/in/marcoscaleb',
        'Contact Quality': 'HIGH',
        'Role': 'Active Promoter',
        'Notes': 'Cambridge, UK. 31 BitHarvest videos (deleted post-collapse Nov 2025). Teamed with Jan Gregory. Also promoted Trade Like Crazy, Titan369, EchoOne.',
        'Verdict': 'MAYBE',
        'Verdict Reason': 'BitHarvest promoter. Channel wiped but TG contact available. History of promoting collapsed schemes.',
    },
    {
        'Channel Name': 'Jan Gregory (Jan Cerato)',
        'Subscribers': '2,220',
        'YouTube URL': 'https://youtube.com/@jangregory',
        'Category': 'BitHarvest',
        'Country': 'Canada',
        'Niche': 'Crypto / MLM',
        'Quality': 'LOW',
        'Fake Risk': 'HIGH',
        'Upload Freq': 'Deleted',
        'Instagram': 'instagram.com/jancerato',
        'Twitter/X': 'x.com/jancerato',
        'Other': 'linkedin.com/in/jancerato. Fined $165K by Alberta Securities Commission (2022). Named in California DFPI order.',
        'Contact Quality': 'MEDIUM',
        'Role': 'Active Promoter',
        'Notes': '33 BitHarvest videos. Disappeared Oct 2 2025 before Nov collapse. Also promoted CoinMarketBull, Vortic United, CloudFi. Fled to Dubai then Malaysia.',
    },
    {
        'Channel Name': 'Bitcoin Wizard Wealth (Mario Emmrich)',
        'Subscribers': '3,100',
        'YouTube URL': 'https://youtube.com/@bitcoinwizardwealth',
        'Category': 'BitHarvest',
        'Country': 'Germany',
        'Niche': 'Crypto / MLM',
        'Quality': 'LOW',
        'Fake Risk': 'HIGH',
        'Upload Freq': 'Active',
        'Twitter/X': 'x.com/emmrich24',
        'Other': 'emmrich.consulting, tiktok.com/@marten925, mountain-wolf.de/mario-emmrich',
        'Contact Quality': 'MEDIUM',
        'Role': 'Active Promoter',
        'Notes': 'German. Lives in Thailand. Promotes CRYPTEX/Bytnex, CRYPTOPRIME, SKAINET, TGI and BitHarvest. Deleted CRYPTEX EUROPEAN COMMUNITY channel. 50K+ referrals claimed.',
    },
    # --- MLM / Passive Income ---
    {
        'Channel Name': 'Crypto ZEUS',
        'Subscribers': '87,500',
        'YouTube URL': 'https://youtube.com/@CryptoZeus',
        'Category': 'Crypto Trading',
        'Country': 'English',
        'Niche': 'Crypto Trading / Analysis',
        'Quality': 'MEDIUM-HIGH',
        'Fake Risk': 'LOW',
        'Upload Freq': 'Regular',
        'Telegram': 't.me/CryptoZeusYT',
        'Other': 'Business TG: @ReaLCryptoZeus, 1800+ videos',
        'Contact Quality': 'HIGH',
        'Role': 'Educator / Analyst',
        'Notes': '87.5K subs. Analytical tone. Altcoin/memecoin analysis. Business via Telegram @ReaLCryptoZeus.',
        'Verdict': 'MAYBE',
        'Verdict Reason': 'Good size (87K), confirmed TG business contact. Crypto trading audience. Worth outreach.',
    },
    {
        'Channel Name': 'CryptoBusy',
        'Subscribers': '325,000',
        'YouTube URL': 'https://youtube.com/@CryptoBusy',
        'Category': 'Crypto Trading',
        'Country': 'UK',
        'Niche': 'Crypto News / Trading Signals',
        'Quality': 'HIGH',
        'Fake Risk': 'LOW',
        'Upload Freq': 'Regular',
        'Telegram': 't.me/CryptoBusyTG',
        'Twitter/X': 'x.com/CryptoBusy',
        'Other': 'patreon.com/cryptobusy, cryptobusy.co.uk, t.me/Crypto_Busy (chat)',
        'Contact Quality': 'HIGH',
        'Role': 'Educator / Signal Provider',
        'Notes': 'Run by Tom and Josh. Since 2018. 325K subs. Free trading signals. Multiple TG channels.',
        'Verdict': 'RECOMMEND',
        'Verdict Reason': 'Large channel (325K), UK-based, excellent contacts (TG+Twitter+Patreon). Trading signals audience = copy-trading fit.',
    },
    {
        'Channel Name': 'Crypto Jebb',
        'Subscribers': '248,000',
        'YouTube URL': 'https://youtube.com/@CryptoJebb',
        'Category': 'Crypto Trading',
        'Country': 'USA',
        'Niche': 'Crypto Trading / TA',
        'Quality': 'HIGH',
        'Fake Risk': 'LOW',
        'Upload Freq': 'Regular',
        'Telegram': 't.me/Coffeen_N_Crypto',
        'Twitter/X': 'x.com/CryptoJebb',
        'Other': 'cryptojebb.com, Since Nov 2017',
        'Contact Quality': 'HIGH',
        'Role': 'Educator / Analyst',
        'Notes': '248K subs. Bitcoin TA, crypto trading signals. Twitter 71.2K followers. Active since 2017.',
        'Verdict': 'RECOMMEND',
        'Verdict Reason': 'Large established channel (248K, since 2017). TG+email+Twitter. TA/trading audience perfect for copy-trading.',
    },
    {
        'Channel Name': 'Altcoin Buzz',
        'Subscribers': '200,000',
        'YouTube URL': 'https://youtube.com/@AltcoinBuzz',
        'Category': 'Crypto News',
        'Country': 'English',
        'Niche': 'Altcoin / DeFi / NFT',
        'Quality': 'HIGH',
        'Fake Risk': 'LOW',
        'Upload Freq': 'Daily',
        'Telegram': 't.me/joinchat/DLi8Ug8negQrbwYO-oqNRA',
        'Other': 'altcoinbuzz.io, altcoinbuzz.io/contact/',
        'Contact Quality': 'HIGH',
        'Role': 'Media / News',
        'Notes': '200K+ community. Established crypto media brand. Contact via website.',
        'Verdict': 'RECOMMEND',
        'Verdict Reason': 'Major crypto media brand (200K+). Professional contact channels. Great for sponsored content.',
    },
    {
        'Channel Name': 'DeFi Dojo',
        'Subscribers': '64,300',
        'YouTube URL': 'https://youtube.com/@DefiDojo',
        'Category': 'DeFi / Passive Income',
        'Country': 'English',
        'Niche': 'DeFi / Yield Farming',
        'Quality': 'MEDIUM-HIGH',
        'Fake Risk': 'LOW',
        'Upload Freq': 'Regular',
        'Telegram': 't.me/DefiDojo',
        'Other': 'Discord VIP: launchpass.com/defi-dojo1/vip/v2',
        'Contact Quality': 'HIGH',
        'Role': 'Educator',
        'Notes': 'Run by Stephen TCG. 64K subs. Yield farming, DeFi strategies, crypto calculators. Paid Discord VIP.',
        'Verdict': 'RECOMMEND',
        'Verdict Reason': 'DeFi passive income focus (64K subs). Audience interested in yield = copy-trading audience. TG available.',
    },
    {
        'Channel Name': 'Jacob Crypto Bury',
        'Subscribers': '53,900',
        'YouTube URL': 'https://youtube.com/@JacobCryptoBury',
        'Category': 'Crypto Trading',
        'Country': 'English',
        'Niche': 'Altcoin / Presales',
        'Quality': 'MEDIUM',
        'Fake Risk': 'MEDIUM',
        'Upload Freq': 'Regular',
        'Telegram': 't.me/jacobcryptobury_07',
        'Twitter/X': 'x.com/BuryCrypto',
        'Other': 'Discord: "Jacobs Crypto Clan", t.me/jacobcryptoburyyt, writes for CryptoNews.com',
        'Contact Quality': 'HIGH',
        'Role': 'Promoter / Reviewer',
        'Notes': '53.9K subs. Multiple TG channels. Active presale/altcoin promoter. Open for business.',
        'Verdict': 'MAYBE',
        'Verdict Reason': 'Good size, multiple TG contacts, open for promotions. Presale audience overlaps with trading platforms.',
    },
    {
        'Channel Name': 'CryptoLabs Research',
        'Subscribers': '36,500',
        'YouTube URL': 'https://youtube.com/@CryptoLabsResearch',
        'Category': 'DeFi / Passive Income',
        'Country': 'English',
        'Niche': 'DeFi / Passive Income',
        'Quality': 'MEDIUM-HIGH',
        'Fake Risk': 'LOW',
        'Upload Freq': 'Regular',
        'Email': 'info@cryptolabsresearch.com',
        'Twitter/X': 'x.com/CryptoLabsInc',
        'Other': 'cryptolabsresearch.com, Offers paid coaching',
        'Contact Quality': 'HIGH',
        'Role': 'Educator / Coach',
        'Notes': '36.5K subs. "Goal: $1000/day passive income." DeFi yield farming strategies. Paid coaching programs.',
        'Verdict': 'RECOMMEND',
        'Verdict Reason': 'Passive income focused (36K). $1000/day goal = exactly our audience. Email confirmed. Coaching model.',
    },
    {
        'Channel Name': 'DeFi Club',
        'Subscribers': '10,800',
        'YouTube URL': 'https://youtube.com/@DefiClub',
        'Category': 'DeFi / Passive Income',
        'Country': 'English',
        'Niche': 'DeFi / Passive Income',
        'Quality': 'MEDIUM',
        'Fake Risk': 'LOW',
        'Upload Freq': 'Regular',
        'Telegram': 't.me/deficlubnew',
        'Other': 'deficlub.website, TG Manager: @AaronD3MORE',
        'Contact Quality': 'HIGH',
        'Role': 'Community',
        'Notes': '10.8K subs. DeFi passive income. Direct TG manager @AaronD3MORE for business.',
        'Verdict': 'MAYBE',
        'Verdict Reason': 'Small but focused DeFi passive income channel. Direct manager contact on Telegram.',
    },
    {
        'Channel Name': 'Digital Degen',
        'Subscribers': '10,000',
        'YouTube URL': 'https://youtube.com/@DigitalDegen',
        'Category': 'MLM Promoter',
        'Country': 'UK',
        'Niche': 'Crypto / HYIP / MLM',
        'Quality': 'LOW',
        'Fake Risk': 'MEDIUM',
        'Upload Freq': 'Regular',
        'Email': 'DigitalDegen44@gmail.com',
        'Twitter/X': 'x.com/stephencolwill',
        'Other': 'TG group: "Digital Degens GAMBLING Group" (400+ members)',
        'Contact Quality': 'HIGH',
        'Role': 'Active Promoter',
        'Notes': 'Steve Colwill. Promotes Beonbit (1-3% daily), BitGem Finance (60% monthly), TetherBot, Meta AI Box, LegitMiners. Exposed by Danny de Hek.',
        'Verdict': 'MAYBE',
        'Verdict Reason': 'Prolific HYIP/MLM promoter (10K). Email+TG confirmed. Promotes daily-return schemes = our audience.',
    },
    {
        'Channel Name': 'Token Metrics',
        'Subscribers': '50,000',
        'YouTube URL': 'https://youtube.com/@TokenMetrics',
        'Category': 'Crypto Trading',
        'Country': 'USA',
        'Niche': 'AI Crypto Analysis',
        'Quality': 'HIGH',
        'Fake Risk': 'LOW',
        'Upload Freq': 'Regular',
        'Email': 'promo@tokenmetrics.com',
        'Twitter/X': 'x.com/tokenmetricsinc',
        'Other': 'tokenmetrics.com, AI/ML crypto analysis platform',
        'Contact Quality': 'HIGH',
        'Role': 'Platform / Media',
        'Notes': 'AI-driven crypto analytics. Open for marketing/sponsorship. Founded by Ian Balina.',
        'Verdict': 'RECOMMEND',
        'Verdict Reason': 'Professional platform with promo email. AI trading angle fits our product. Sponsorship-ready.',
    },
    {
        'Channel Name': 'Son of a Tech',
        'Subscribers': '45,000',
        'YouTube URL': 'https://youtube.com/@SonofaTech',
        'Category': 'Crypto Mining',
        'Country': 'USA',
        'Niche': 'Crypto Mining / Passive Income',
        'Quality': 'MEDIUM-HIGH',
        'Fake Risk': 'LOW',
        'Upload Freq': 'Regular',
        'Email': 'inquiry@sonofatech.com',
        'Other': 'Next Tuesday LLC, 14546 Brook Hollow BLVD #356, San Antonio TX 78232',
        'Contact Quality': 'HIGH',
        'Role': 'Educator',
        'Notes': 'San Antonio TX. Bitcoin/Ethereum mining, passive income. Business email + mailing address confirmed.',
        'Verdict': 'MAYBE',
        'Verdict Reason': 'Mining/passive income channel with confirmed business email and address. Professional operation.',
    },
    {
        'Channel Name': 'MoneyZG',
        'Subscribers': '714,000',
        'YouTube URL': 'https://youtube.com/@MoneyZG',
        'Category': 'Crypto Education',
        'Country': 'English',
        'Niche': 'Trading / Education',
        'Quality': 'HIGH',
        'Fake Risk': 'LOW',
        'Upload Freq': 'Regular',
        'Instagram': 'instagram.com/moneyzg',
        'Twitter/X': 'x.com/moneyzg',
        'Other': 'Twitter 41.2K, Instagram 28.3K, Facebook 5.6K',
        'Contact Quality': 'MEDIUM',
        'Role': 'Educator',
        'Notes': '714K subs. Trading strategies, exchange reviews. Since March 2021. Check YouTube About for business email.',
        'Verdict': 'MAYBE',
        'Verdict Reason': 'Very large channel (714K). Trading education. No direct contact found yet - check YouTube About page.',
    },
    {
        'Channel Name': 'Conor Kenny',
        'Subscribers': '140,000',
        'YouTube URL': 'https://youtube.com/@ConorKenny',
        'Category': 'Crypto Education',
        'Country': 'English',
        'Niche': 'Bitcoin / Daily Crypto',
        'Quality': 'HIGH',
        'Fake Risk': 'LOW',
        'Upload Freq': 'Daily',
        'Instagram': 'instagram.com/itsconorkenny',
        'Twitter/X': 'x.com/conorrkenny',
        'Other': 'thecryptokickstart.com, Instagram 50K followers',
        'Contact Quality': 'MEDIUM',
        'Role': 'Educator',
        'Notes': '140K subs. Daily crypto content. Bitcoin education. Website + strong social media presence.',
        'Verdict': 'MAYBE',
        'Verdict Reason': 'Large daily channel (140K). Strong social presence. Check YouTube About for business email.',
    },
    {
        'Channel Name': 'vitocacrypto',
        'Subscribers': '209,000',
        'YouTube URL': 'https://youtube.com/@vitocacrypto',
        'Category': 'Crypto Education',
        'Country': 'Mexico',
        'Niche': 'Crypto / Investment (Spanish)',
        'Quality': 'HIGH',
        'Fake Risk': 'LOW',
        'Upload Freq': 'Regular',
        'Other': 'Open to advertising partnerships for project launches. Spanish language.',
        'Contact Quality': 'MEDIUM',
        'Role': 'Educator / Promoter',
        'Notes': 'Victor Caraveo, Tabasco Mexico. 209K subs. Spanish-language. Explicitly open to project promotions and sponsorships.',
        'Verdict': 'RECOMMEND',
        'Verdict Reason': 'Large Spanish channel (209K). Explicitly open to paid promotions. Covers Latin America market.',
    },
    {
        'Channel Name': 'Savvy Finance',
        'Subscribers': '186,000',
        'YouTube URL': 'https://youtube.com/@SavvyFinance',
        'Category': 'Crypto Education',
        'Country': 'English',
        'Niche': 'Crypto / NFT / Education',
        'Quality': 'HIGH',
        'Fake Risk': 'LOW',
        'Upload Freq': 'Regular',
        'Instagram': 'instagram.com/officialsavvyfinance',
        'Other': 'GigaStar investment offering ($762K valuation). 1237 uploads. Instagram 14K.',
        'Contact Quality': 'MEDIUM',
        'Role': 'Educator',
        'Notes': 'Osamudiamen Omere. 186K subs. Crypto education, NFTs, passive income. Check YouTube About for email.',
        'Verdict': 'MAYBE',
        'Verdict Reason': 'Large channel (186K). Covers passive income. Check YouTube About for business email.',
    },
    # --- Unimine new ---
    {
        'Channel Name': 'La Ruta Lider',
        'Subscribers': '910',
        'YouTube URL': 'https://youtube.com/@larutalider',
        'Category': 'Uniminepool',
        'Country': 'Latin America',
        'Niche': 'Passive Income / Crypto (Spanish)',
        'Quality': 'LOW',
        'Fake Risk': 'LOW',
        'Upload Freq': 'Regular',
        'Telegram': 't.me/liderescrypto',
        'Other': 'linktr.ee/leadersroadpro (shared with Leaders Road), TG DM: @Will_The_Leader',
        'Contact Quality': 'HIGH',
        'Role': 'Active Promoter',
        'Notes': 'Spanish-language mirror of Leaders Road (same operator Will). 1 Unimine video "Asi Funciona UniMine Pool".',
        'Verdict': 'MAYBE',
        'Verdict Reason': 'Very small (910 subs) but covers Spanish market. Same operator as Leaders Road (8K). Contact @Will_The_Leader.',
    },
]


def is_bad_row(name_str):
    if not name_str:
        return True
    name = str(name_str).strip()
    if re.match(r'^\[[\d.]+\]', name):
        return True
    if re.match(r'^\[AD:\d+\]', name):
        return True
    if 'LINE 48' in name:
        return True
    if name.startswith('---'):
        return True
    return False


def normalize_url(url):
    if not url:
        return None
    return str(url).strip().lower().replace('https://', '').replace('http://', '').rstrip('/')


def parse_subs(s):
    if not s:
        return 0
    s = str(s).replace(',', '').replace('+', '').strip()
    s = re.sub(r'[^\d]', '', s.split('.')[0] if '.' not in s else s)
    try:
        return int(s)
    except:
        return 0


def count_fields(data, headers):
    return sum(1 for h in headers if data.get(h) and str(data[h]).strip())


def main():
    print("Loading workbook...")
    wb = openpyxl.load_workbook('YouTubers_Report_v2_CLEANED.xlsx')
    ws = wb.active
    headers = [ws.cell(row=1, column=c).value for c in range(1, ws.max_column + 1)]
    print(f"Headers: {headers}")

    # Read all rows
    all_rows = []
    for row in range(2, ws.max_row + 1):
        data = {}
        for col in range(1, len(headers) + 1):
            val = ws.cell(row=row, column=col).value
            if val is not None:
                data[headers[col - 1]] = val
        name = data.get('Channel Name')
        if name and not is_bad_row(name):
            all_rows.append(data)

    print(f"Loaded rows: {len(all_rows)}")

    # Dedup by URL
    url_map = {}
    deduped = []
    for rd in all_rows:
        url = normalize_url(rd.get('YouTube URL'))
        if url is None:
            if rd.get('Channel Name'):
                deduped.append(rd)
            continue
        if url in url_map:
            idx = url_map[url]
            if count_fields(rd, headers) > count_fields(deduped[idx], headers):
                old = deduped[idx]
                for h in headers:
                    if (h not in rd or rd[h] is None) and h in old and old[h] is not None:
                        rd[h] = old[h]
                deduped[idx] = rd
        else:
            url_map[url] = len(deduped)
            deduped.append(rd)

    print(f"After URL dedup: {len(deduped)}")

    # Dedup by name
    name_map = {}
    final = []
    for rd in deduped:
        nm = str(rd.get('Channel Name', '')).strip().lower()
        clean = re.sub(r'[^\w\s]', '', nm).strip()
        if clean in name_map:
            idx = name_map[clean]
            if count_fields(rd, headers) > count_fields(final[idx], headers):
                old = final[idx]
                for h in headers:
                    if (h not in rd or rd[h] is None) and h in old and old[h] is not None:
                        rd[h] = old[h]
                final[idx] = rd
        else:
            name_map[clean] = len(final)
            final.append(rd)

    print(f"After name dedup: {len(final)}")

    # Apply contact updates (merge, don't overwrite existing)
    updated = 0
    for rd in final:
        name = str(rd.get('Channel Name', '')).strip()
        if name in CONTACT_UPDATES:
            for field, value in CONTACT_UPDATES[name].items():
                current = rd.get(field)
                if not current or str(current).strip() == '' or str(current).strip() == '-':
                    rd[field] = value
                    updated += 1
                elif field in ('Notes', 'Other') and value and value not in str(current):
                    rd[field] = str(current) + '. ' + value
                    updated += 1
                elif field == 'Category' and (not current or str(current).strip() in ('None', '')):
                    rd[field] = value
                    updated += 1
    print(f"Contact updates applied: {updated}")

    # Add new channels (check for duplicates)
    existing_names = set()
    existing_urls = set()
    for rd in final:
        nm = str(rd.get('Channel Name', '')).strip().lower()
        clean = re.sub(r'[^\w\s]', '', nm).strip()
        existing_names.add(clean)
        url = normalize_url(rd.get('YouTube URL'))
        if url:
            existing_urls.add(url)

    added = 0
    for ch in NEW_CHANNELS:
        nm = str(ch['Channel Name']).strip().lower()
        clean = re.sub(r'[^\w\s]', '', nm).strip()
        url = normalize_url(ch.get('YouTube URL'))

        if clean in existing_names:
            print(f"  SKIP (name dup): {ch['Channel Name']}")
            continue
        if url and url in existing_urls:
            print(f"  SKIP (URL dup): {ch['Channel Name']}")
            continue

        final.append(ch)
        existing_names.add(clean)
        if url:
            existing_urls.add(url)
        added += 1
        print(f"  ADDED: {ch['Channel Name']} ({ch.get('Subscribers', '?')} subs)")

    print(f"\nAdded {added} new channels")
    print(f"Total channels: {len(final)}")

    # Sort by category, then verdict, then subscribers
    verdict_order = {'RECOMMEND': 0, 'MAYBE': 1}

    def sort_key(rd):
        cat = rd.get('Category') or 'Uncategorized'
        cat = str(cat).strip()
        if cat in ('None', ''):
            cat = 'zzz_Uncategorized'
        v = verdict_order.get(rd.get('Verdict'), 2)
        subs = parse_subs(rd.get('Subscribers'))
        return (cat.lower(), v, -subs)

    final.sort(key=sort_key)

    # Write new workbook
    new_wb = openpyxl.Workbook()
    nws = new_wb.active
    nws.title = 'Channels by Project'

    hdr_fill = PatternFill(start_color='1F4E79', end_color='1F4E79', fill_type='solid')
    hdr_font = Font(name='Calibri', size=11, bold=True, color='FFFFFF')
    rec_fill = PatternFill(start_color='C6EFCE', end_color='C6EFCE', fill_type='solid')
    may_fill = PatternFill(start_color='FFEB9C', end_color='FFEB9C', fill_type='solid')
    nv_fill = PatternFill(start_color='F2F2F2', end_color='F2F2F2', fill_type='solid')
    cat_fill = PatternFill(start_color='D6DCE4', end_color='D6DCE4', fill_type='solid')
    cat_font = Font(name='Calibri', size=11, bold=True, color='1F4E79')
    bdr = Border(left=Side(style='thin'), right=Side(style='thin'),
                 top=Side(style='thin'), bottom=Side(style='thin'))

    for col, h in enumerate(headers, 1):
        c = nws.cell(row=1, column=col, value=h)
        c.fill = hdr_fill
        c.font = hdr_font
        c.alignment = Alignment(horizontal='center', wrap_text=True)
        c.border = bdr

    cur = 2
    cur_cat = None
    num = 1

    for rd in final:
        cat = rd.get('Category') or 'Uncategorized'
        cat_d = str(cat).strip()
        if cat_d in ('None', ''):
            cat_d = 'Uncategorized'

        if cat_d != cur_cat:
            cur_cat = cat_d
            for col in range(1, len(headers) + 1):
                c = nws.cell(row=cur, column=col)
                c.fill = cat_fill
                c.border = bdr
            nws.cell(row=cur, column=3, value=f"--- {cat_d} ---").font = cat_font
            nws.cell(row=cur, column=3).fill = cat_fill
            cur += 1

        nws.cell(row=cur, column=1, value=num).border = bdr
        for col, h in enumerate(headers, 1):
            if h == '#':
                continue
            val = rd.get(h)
            c = nws.cell(row=cur, column=col, value=val)
            c.border = bdr
            c.alignment = Alignment(wrap_text=True, vertical='top')
            v = rd.get('Verdict')
            if v == 'RECOMMEND':
                c.fill = rec_fill
            elif v == 'MAYBE':
                c.fill = may_fill
            elif not v:
                c.fill = nv_fill

        num += 1
        cur += 1

    widths = {'#': 5, 'Verdict': 12, 'Channel Name': 35, 'Subscribers': 12,
              'YouTube URL': 45, 'Category': 18, 'Country': 18, 'Niche': 25,
              'Quality': 12, 'Fake Risk': 10, 'Avg Views': 15, 'View/Sub %': 10,
              'Upload Freq': 12, 'Community (1-10)': 10, 'Engagement': 12,
              'Email': 30, 'Telegram': 30, 'Instagram': 25, 'Twitter/X': 25,
              'WhatsApp': 15, 'Other': 35, 'Contact Quality': 12, 'Role': 20,
              'Notes': 50, 'Verdict Reason': 60}
    for col, h in enumerate(headers, 1):
        nws.column_dimensions[openpyxl.utils.get_column_letter(col)].width = widths.get(h, 15)

    nws.freeze_panes = 'A2'
    nws.auto_filter.ref = f'A1:{openpyxl.utils.get_column_letter(len(headers))}{cur - 1}'

    new_wb.save('YouTubers_Report_v2_CLEANED.xlsx')

    # Stats
    hc = sum(1 for rd in final if any(rd.get(f) and str(rd[f]).strip() and str(rd[f]).strip() != '-'
             for f in ['Email', 'Telegram', 'WhatsApp']))
    tg = sum(1 for rd in final if rd.get('Telegram') and str(rd['Telegram']).strip()
             and str(rd['Telegram']).strip() != '-' and 't.me' in str(rd['Telegram']))
    twit = sum(1 for rd in final if rd.get('Twitter/X') and str(rd['Twitter/X']).strip()
               and str(rd['Twitter/X']).strip() != '-')
    ig = sum(1 for rd in final if rd.get('Instagram') and str(rd['Instagram']).strip()
             and str(rd['Instagram']).strip() != '-')
    rec = sum(1 for r in final if r.get('Verdict') == 'RECOMMEND')
    may = sum(1 for r in final if r.get('Verdict') == 'MAYBE')

    # Count categories
    cats = {}
    for rd in final:
        cat = rd.get('Category') or 'Uncategorized'
        cat = str(cat).strip()
        if cat in ('None', ''):
            cat = 'Uncategorized'
        cats[cat] = cats.get(cat, 0) + 1

    print(f"\n{'='*50}")
    print(f"FINAL STATS")
    print(f"{'='*50}")
    print(f"Total channels: {len(final)}")
    print(f"With direct contacts (Email/TG/WA): {hc}")
    print(f"With Telegram (t.me links): {tg}")
    print(f"With Twitter/X: {twit}")
    print(f"With Instagram: {ig}")
    print(f"RECOMMEND: {rec}")
    print(f"MAYBE: {may}")
    print(f"\nBy category:")
    for cat in sorted(cats.keys()):
        print(f"  {cat}: {cats[cat]}")
    print("Done!")


if __name__ == '__main__':
    main()
