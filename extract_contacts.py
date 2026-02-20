"""Extract contacts from YouTube channel JSON dumps"""
import subprocess, re, json, os, sys

os.environ['PYTHONIOENCODING'] = 'utf-8'

CHANNELS = {
    'Leaders Road': ('UCmivOqRNl_KyAzSlna2GjvA', '@LeadersRoad'),
    'ONLINE PASSIVE AND ACTIVE INCOME': ('UClmMW1JDlNVUI-8WCwqt8vw', '@online-passive-income-l8l'),
    'Creative Life Freedom': ('UC2kX9IoDbTCUbhAfq56SVmA', '@CreativeProfitsAcademy'),
    'The Perfect Wealth': ('UCWRcXrv_nCrWFN6IBcr7ucA', '@ThePerfectWealth'),
    'ACE D': ('UCcPhZC26ZPYm2D1QYc3DABg', '@Ace_ofAllTrades'),
    'La Ruta Lider': ('UCsG6MrbheQIafMrlN0RMWJQ', '@larutalider'),
    'Crypto Primetime': ('UCECqzXfqvXDLi76s2dHMBCA', '@CryptoPrimetime'),
    'Uniminepool Official': ('UC6w6jQUIOxHdIKAtKPbv-Uw', '@Uniminepool'),
}

SKIP_EMAIL = ['youtube.', 'google.', 'noreply', 'ytimg', 'googleapis', 'sentry', 'example', 'gstatic']
SKIP_TW = {'intent', 'share', 'home', 'search', 'i', 'hashtag', 'explore', 'settings', 'compose'}
SKIP_FB = {'sharer', 'share', 'dialog', 'plugins', 'tr', 'watch', 'gaming', 'privacy', 'help'}
SKIP_URL_STARTS = [
    'www.youtube', 'accounts.google', 'play.google', 'support.google',
    'policies.google', 'music.youtube', 'www.google', 'm.youtube',
    'redirect.googlevideo', 'i.ytimg', 'yt3.', 'lh3.', 'static.double',
    'googleads', 'pagead', 'fonts.google', 'www.gstatic', 'jnn-pa.',
    'schemas.microsoft', 'manifest.json',
]


def extract(txt):
    result = {}

    # Emails
    emails = set(re.findall(r'[\w.+-]+@[\w-]+\.[\w.-]+', txt))
    emails = [e for e in emails if not any(x in e.lower() for x in SKIP_EMAIL)]
    result['email'] = list(set(emails))[:5]

    # Telegram
    tg = list(set(re.findall(r'(?:t\.me|telegram\.me)/([a-zA-Z0-9_]+)', txt, re.I)))
    result['telegram'] = tg[:5]

    # Instagram
    ig = list(set(re.findall(r'instagram\.com/([a-zA-Z0-9_.]+)', txt, re.I)))
    result['instagram'] = ig[:5]

    # Twitter/X
    tw = list(set(re.findall(r'(?:twitter\.com|x\.com)/([a-zA-Z0-9_]+)', txt, re.I)))
    tw = [t for t in tw if t.lower() not in SKIP_TW]
    result['twitter'] = tw[:5]

    # WhatsApp
    wa = list(set(re.findall(r'(?:wa\.me|whatsapp\.com/(?:channel|send))/([a-zA-Z0-9+]+)', txt, re.I)))
    result['whatsapp'] = wa[:5]

    # Facebook
    fb = list(set(re.findall(r'(?:facebook\.com|fb\.com)/([a-zA-Z0-9.]+)', txt, re.I)))
    fb = [f for f in fb if f.lower() not in SKIP_FB]
    result['facebook'] = fb[:5]

    # Discord
    dc = list(set(re.findall(r'discord\.(?:gg|com/invite)/([a-zA-Z0-9]+)', txt, re.I)))
    result['discord'] = dc[:5]

    # Linktree
    lt = list(set(re.findall(r'linktr\.ee/([a-zA-Z0-9_.]+)', txt, re.I)))
    result['linktree'] = lt[:5]

    # TikTok
    tiktok = list(set(re.findall(r'tiktok\.com/@([a-zA-Z0-9_.]+)', txt, re.I)))
    result['tiktok'] = tiktok[:5]

    # External URLs
    urls = re.findall(r'"url":\s*"(https?://[^"]+)"', txt)
    ext = []
    for u in urls:
        domain = u.split('//')[1].split('/')[0] if '//' in u else ''
        if not any(domain.startswith(s) for s in SKIP_URL_STARTS):
            ext.append(u)
    result['external_urls'] = list(set(ext))[:15]

    # Description
    desc = re.findall(r'"description":\s*"((?:[^"\\]|\\.)*)"', txt[:50000])
    result['description'] = desc[0][:600] if desc else ''

    # Channel URL / uploader_url
    uploader = re.findall(r'"uploader_url":\s*"([^"]+)"', txt[:10000])
    result['uploader_url'] = uploader[0] if uploader else ''

    # Language
    lang = re.findall(r'"language":\s*"([^"]+)"', txt[:10000])
    result['language'] = lang[0] if lang else ''

    return result


def get_json(handle):
    """Get channel JSON via yt-dlp"""
    r = subprocess.run(
        ['python', '-m', 'yt_dlp',
         f'https://youtube.com/{handle}',
         '--playlist-items', '1:1',
         '--dump-single-json', '--no-warnings', '--quiet'],
        capture_output=True, text=True, encoding='utf-8', errors='replace',
        timeout=90
    )
    return r.stdout[:120000] if r.stdout else ''


def main():
    for name, (cid, handle) in CHANNELS.items():
        print(f'\n{"="*60}')
        print(f'CHANNEL: {name}')
        print(f'ID: {cid}')
        print(f'Handle: https://youtube.com/{handle}')
        print(f'{"="*60}')

        txt = get_json(handle)
        if not txt:
            print('  ERROR: Could not fetch channel data')
            continue

        info = extract(txt)

        for key in ['email', 'telegram', 'instagram', 'twitter', 'whatsapp',
                     'facebook', 'discord', 'linktree', 'tiktok']:
            val = info.get(key, [])
            if val:
                print(f'  {key.upper():12s}: {val}')

        if info['external_urls']:
            print(f'  EXT URLS    : {info["external_urls"]}')

        if info['language']:
            print(f'  LANGUAGE    : {info["language"]}')

        if info['description']:
            print(f'  DESCRIPTION : {info["description"][:400]}')


if __name__ == '__main__':
    main()
