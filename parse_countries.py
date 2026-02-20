"""
Parse countries for channels missing country info.
Uses video language metadata + channel name/description heuristics.
"""
import subprocess, re, json, openpyxl, os
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed

os.environ['PYTHONIOENCODING'] = 'utf-8'

# Language code -> Country mapping
LANG_TO_COUNTRY = {
    'hi': 'India',
    'ta': 'India',
    'te': 'India',
    'kn': 'India',
    'ml': 'India',
    'mr': 'India',
    'gu': 'India',
    'pa': 'India',
    'bn': 'India/Bangladesh',
    'or': 'India',
    'as': 'India',
    'ne': 'Nepal',
    'si': 'Sri Lanka',
    'ur': 'Pakistan',
    'ar': 'Middle East/North Africa',
    'fa': 'Iran',
    'tr': 'Turkey',
    'ru': 'Russia/CIS',
    'uk': 'Ukraine',
    'pl': 'Poland',
    'cs': 'Czech Republic',
    'ro': 'Romania',
    'hu': 'Hungary',
    'bg': 'Bulgaria',
    'sr': 'Serbia',
    'hr': 'Croatia',
    'sk': 'Slovakia',
    'sl': 'Slovenia',
    'es': 'Latin America/Spain',
    'pt': 'Brazil/Portugal',
    'fr': 'France/Africa',
    'de': 'Germany',
    'it': 'Italy',
    'nl': 'Netherlands',
    'sv': 'Sweden',
    'no': 'Norway',
    'da': 'Denmark',
    'fi': 'Finland',
    'el': 'Greece',
    'id': 'Indonesia',
    'ms': 'Malaysia',
    'tl': 'Philippines',
    'fil': 'Philippines',
    'th': 'Thailand',
    'vi': 'Vietnam',
    'zh': 'China',
    'ja': 'Japan',
    'ko': 'Korea',
    'sw': 'East Africa',
    'ha': 'Nigeria',
    'yo': 'Nigeria',
    'ig': 'Nigeria',
    'am': 'Ethiopia',
    'rw': 'Rwanda',
    'rn': 'Burundi',
    'mg': 'Madagascar',
    'zu': 'South Africa',
    'xh': 'South Africa',
    'af': 'South Africa',
    'km': 'Cambodia',
    'lo': 'Laos',
    'my': 'Myanmar',
    'ka': 'Georgia',
    'hy': 'Armenia',
    'az': 'Azerbaijan',
    'kk': 'Kazakhstan',
    'uz': 'Uzbekistan',
    'tg': 'Tajikistan',
    'ky': 'Kyrgyzstan',
    'mn': 'Mongolia',
}

# Keywords in channel name / description -> country
NAME_KEYWORDS = {
    'India': ['india', 'hindi', 'भारत', 'हिंदी', 'desi', 'tamil', 'telugu', 'kannada', 'malayalam', 'marathi', 'gujarati', 'punjabi', 'bangla', 'bengali'],
    'Pakistan': ['pakistan', 'urdu', 'پاکستان', 'اردو'],
    'Bangladesh': ['bangladesh', 'bangla', 'বাংলা'],
    'Nigeria': ['nigeria', 'naira', 'naija', 'yoruba', 'igbo', 'hausa'],
    'Kenya': ['kenya', 'kenyan', 'nairobi'],
    'Ghana': ['ghana', 'ghanaian', 'accra'],
    'South Africa': ['south africa', 'south african', 'johannesburg', 'cape town'],
    'Philippines': ['philippines', 'filipino', 'tagalog', 'pinoy', 'pilipinas'],
    'Indonesia': ['indonesia', 'indonesian', 'bahasa'],
    'Vietnam': ['vietnam', 'vietnamese', 'việt'],
    'Thailand': ['thailand', 'thai', 'ไทย'],
    'Brazil': ['brazil', 'brasil', 'português', 'portuguese'],
    'Latin America': ['español', 'spanish', 'latino', 'dinero', 'ganar'],
    'Russia/CIS': ['russia', 'russian', 'русский', 'россия', 'украина', 'пассив', 'заработок', 'крипто'],
    'Turkey': ['turkey', 'türk', 'türkiye', 'turkish'],
    'Rwanda': ['rwanda', 'kinyarwanda', 'rwandan'],
    'Burundi': ['burundi', 'kirundi'],
    'East Africa': ['east africa', 'swahili', 'kiswahili'],
    'Middle East': ['arabic', 'عربي', 'dubai', 'saudi', 'uae', 'qatar', 'kuwait', 'bahrain', 'oman'],
    'Iran': ['iran', 'persian', 'فارسی'],
    'Nepal': ['nepal', 'nepali', 'नेपाल'],
    'Sri Lanka': ['sri lanka', 'sinhala', 'srilankan'],
    'Cambodia': ['cambodia', 'khmer', 'cambodian'],
    'Myanmar': ['myanmar', 'burmese'],
    'Malaysia': ['malaysia', 'malay'],
    'Ethiopia': ['ethiopia', 'amharic', 'ethiopian'],
    'France/Africa': ['france', 'french', 'français', 'afrique', 'francophone'],
    'Germany': ['germany', 'german', 'deutsch'],
    'Italy': ['italy', 'italian', 'italiano'],
    'Poland': ['poland', 'polish', 'polski'],
    'Romania': ['romania', 'romanian', 'română'],
    'Ukraine': ['ukraine', 'ukrainian', 'україна'],
    'Korea': ['korea', 'korean', '한국'],
    'Japan': ['japan', 'japanese', '日本'],
    'China': ['china', 'chinese', '中国'],
}


def get_channel_country(channel_url):
    """Get country from channel's video language and metadata"""
    try:
        url = channel_url.rstrip('/')
        if not url.startswith('http'):
            url = 'https://' + url

        r = subprocess.run(
            ['python', '-m', 'yt_dlp',
             url,
             '--playlist-items', '1:1',
             '--print', '%(language)s|||%(channel)s|||%(title)s|||%(description).300s|||%(tags)s',
             '--no-warnings', '--quiet'],
            capture_output=True, text=True, encoding='utf-8', errors='replace',
            timeout=45
        )

        line = r.stdout.strip().split('\n')[0] if r.stdout.strip() else ''
        parts = line.split('|||')

        lang = parts[0].strip() if len(parts) > 0 else ''
        channel_name = parts[1].strip() if len(parts) > 1 else ''
        title = parts[2].strip() if len(parts) > 2 else ''
        desc = parts[3].strip() if len(parts) > 3 else ''
        tags = parts[4].strip() if len(parts) > 4 else ''

        all_text = f'{channel_name} {title} {desc} {tags}'.lower()

        # Method 1: Language code
        if lang and lang != 'NA' and lang in LANG_TO_COUNTRY:
            return LANG_TO_COUNTRY[lang]

        # Method 2: For English videos, check name/description keywords
        if lang in ('en', 'EN', 'NA', '', None):
            for country, keywords in NAME_KEYWORDS.items():
                for kw in keywords:
                    if kw in all_text:
                        return country

        # Method 3: Check for non-ASCII characters in title/description
        if any('\u0900' <= c <= '\u097F' for c in all_text):  # Devanagari
            return 'India'
        if any('\u0600' <= c <= '\u06FF' for c in all_text):  # Arabic
            return 'Middle East/Pakistan'
        if any('\u0E00' <= c <= '\u0E7F' for c in all_text):  # Thai
            return 'Thailand'
        if any('\u0B80' <= c <= '\u0BFF' for c in all_text):  # Tamil
            return 'India'
        if any('\u0C00' <= c <= '\u0C7F' for c in all_text):  # Telugu
            return 'India'
        if any('\u0980' <= c <= '\u09FF' for c in all_text):  # Bengali
            return 'India/Bangladesh'
        if any('\u0400' <= c <= '\u04FF' for c in all_text):  # Cyrillic
            return 'Russia/CIS'

        return ''

    except:
        return ''


def main():
    print("=" * 60)
    print("PARSING COUNTRIES for all channels")
    print("=" * 60)

    wb = openpyxl.load_workbook('YouTubers_Report_v2.xlsx')
    contacts_ws = wb['Contacts']
    bloggers_ws = wb['All Bloggers']

    # Find channels without country in Contacts sheet
    to_parse = []
    for row_idx in range(2, contacts_ws.max_row + 1):
        name = contacts_ws.cell(row=row_idx, column=2).value
        country = contacts_ws.cell(row=row_idx, column=5).value
        url = contacts_ws.cell(row=row_idx, column=14).value

        if name and url and (not country or not str(country).strip()):
            to_parse.append((row_idx, name, url))

    print(f"Channels without country: {len(to_parse)}")
    print(f"Parsing with 5 workers...\n")

    # Parse countries in parallel
    results = {}
    with ThreadPoolExecutor(max_workers=5) as ex:
        futures = {}
        for row_idx, name, url in to_parse:
            futures[ex.submit(get_channel_country, url)] = (row_idx, name)

        done = 0
        country_counts = Counter()
        for f in as_completed(futures):
            done += 1
            row_idx, name = futures[f]
            country = f.result()
            results[row_idx] = country
            if country:
                country_counts[country] += 1

            if done % 50 == 0 or done == len(futures):
                found = sum(1 for c in results.values() if c)
                print(f"  [{done}/{len(futures)}] Found country for {found} channels")

    # Write countries to Contacts sheet
    found_count = 0
    for row_idx, country in results.items():
        if country:
            contacts_ws.cell(row=row_idx, column=5, value=country)
            found_count += 1

    print(f"\nCountries found: {found_count} / {len(to_parse)}")

    # Show distribution
    print("\nCountry distribution (new):")
    for country, cnt in country_counts.most_common():
        print(f"  {cnt:>3} | {country}")

    # Sync countries to All Bloggers sheet
    # Build name -> country map from Contacts
    name_country = {}
    for row_idx in range(2, contacts_ws.max_row + 1):
        name = contacts_ws.cell(row=row_idx, column=2).value
        country = contacts_ws.cell(row=row_idx, column=5).value
        if name and country:
            name_country[name.strip().lower()] = country

    # Update All Bloggers (country is column 6)
    updated_bloggers = 0
    for row_idx in range(2, bloggers_ws.max_row + 1):
        name = bloggers_ws.cell(row=row_idx, column=2).value
        existing = bloggers_ws.cell(row=row_idx, column=6).value
        if name and (not existing or not str(existing).strip()):
            country = name_country.get(name.strip().lower(), '')
            if country:
                bloggers_ws.cell(row=row_idx, column=6, value=country)
                updated_bloggers += 1

    print(f"\nAll Bloggers updated: {updated_bloggers} countries added")

    # Save
    try:
        wb.save('YouTubers_Report_v2.xlsx')
        print("\nSaved!")
    except PermissionError:
        wb.save('YouTubers_Report_v2_countries.xlsx')
        print("\n** Locked! Saved to YouTubers_Report_v2_countries.xlsx **")

    # Final stats
    total_with_country = 0
    total = 0
    all_countries = Counter()
    for row_idx in range(2, contacts_ws.max_row + 1):
        name = contacts_ws.cell(row=row_idx, column=2).value
        country = contacts_ws.cell(row=row_idx, column=5).value
        if name:
            total += 1
            if country and str(country).strip():
                total_with_country += 1
                all_countries[country] += 1

    print(f"\n{'='*60}")
    print(f"FINAL: {total_with_country}/{total} channels have country ({total - total_with_country} unknown)")
    print(f"{'='*60}")
    for country, cnt in all_countries.most_common():
        print(f"  {cnt:>3} | {country}")


if __name__ == '__main__':
    main()
