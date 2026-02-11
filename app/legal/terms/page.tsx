'use client';

import LegalPage from '@/components/LegalPage';

export default function TermsOfService() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="December 29, 2024"
      effectiveDate="January 1, 2025"
      sections={[
        {
          title: "Introduction",
          content: `Welcome to Cloudbright, a copy trading bot marketplace and social investment platform operated by HONG KONG CLOUD BRIGHT SOFTWARE LIMITED ("Cloudbright", "we", "us", or "our"). These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "Investor", "you", or "your") and HONG KONG CLOUD BRIGHT SOFTWARE LIMITED governing your access to and use of our platform, services, and related offerings.

Cloudbright enables investors to browse, compare, and copy verified trading bots that trade automatically on their behalf. The platform provides full transparency into bot performance, including real-time active trades, complete trade history, equity curves, and detailed statistical data. Users deposit funds into protected custodial wallets and select bots to copy — the bots execute trades automatically with the user's capital.

By accessing, registering for, or using our platform in any manner, you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy, Cookie Policy, Risk Disclosure, and all other applicable policies. If you do not agree to these Terms, you must immediately cease all use of our platform and services.

These Terms apply to all users of the platform, including visitors, registered users, investors, and any other persons who access or use our services. You represent and warrant that you have the legal capacity to enter into this agreement and are not prohibited by law from accessing or using our services.`
        },
        {
          title: "Platform Description & Copy Trading Model",
          content: `Cloudbright is a bot marketplace and copy trading platform. The platform operates as follows:

Custodial Wallets: Upon registration, you receive protected custodial wallets supporting 7+ cryptocurrencies (USDT, BTC, ETH, BNB, USDC, SOL, TRX, and others). Your funds are stored in AES-256 encrypted wallets with 2FA authentication and hardware security module protection. Deposits are credited instantly.

Bot Marketplace: Cloudbright hosts 100+ verified trading bots. Each bot has a public profile with full transparency: real-time active trades, complete trade history, equity curves, win rate, Sharpe ratio, max drawdown, and other statistical data. You can browse, compare, and filter bots by performance metrics before making any investment decision.

Copy Trading: When you copy a bot, you choose your investment amount (minimum $50) and a lock-in period (7 to 180 days). The master bot then trades automatically with your capital. You can monitor every trade in real time from your dashboard. You do not make individual trading decisions — the bot handles all trading activity.

Profit Collection: You can collect realized profits from your copied bots at any time. Once your lock-in period ends, your full investment capital is available for withdrawal.

Commission Model: Cloudbright charges commission only on realized profit. No monthly subscriptions, no setup fees, no hidden charges. If you do not profit, you do not pay.

Social Community: Cloudbright includes social features — leaderboards, bot rankings, community interaction, and the ability to follow and compare top-performing bots.`
        },
        {
          title: "Account Terms",
          content: `To access copy trading features, you must create an account by providing accurate, complete, and current information. You are solely responsible for maintaining the confidentiality of your account credentials, including your username and password, and for all activities that occur under your account.

You agree to immediately notify Cloudbright of any unauthorized access to or use of your account or any other breach of security. We will not be liable for any loss or damage arising from your failure to protect your account credentials. You may not use another user's account without permission, share your account credentials with any third party, or transfer your account to any other person or entity.

You must be at least 18 years of age or the age of majority in your jurisdiction, whichever is greater, to create an account and use our services. By creating an account, you represent and warrant that you meet these age requirements and that all information provided during registration is accurate and truthful.

Cloudbright reserves the right to refuse service, terminate accounts, or restrict access at our sole discretion, particularly in cases of suspected fraudulent activity, violation of these Terms, or any other conduct that we deem harmful to other users or to our business interests.`
        },
        {
          title: "User Obligations",
          content: `As a user of the Cloudbright platform, you agree to use our services only for lawful purposes and in accordance with these Terms. You shall not use the platform in any manner that could damage, disable, overburden, or impair our servers or networks, or interfere with any other user's experience.

You agree not to engage in any of the following prohibited activities: (a) attempting to gain unauthorized access to any portion of the platform or any connected systems; (b) using any automated system, including robots, spiders, or scrapers, to access the platform without our express written permission; (c) transmitting any viruses, worms, malware, or other malicious code; (d) attempting to manipulate bot statistics, leaderboard rankings, or community features; (e) violating any applicable laws or regulations, including anti-money laundering and counter-terrorism financing laws.

You are responsible for obtaining and maintaining all equipment and services needed to access the platform. You bear all costs associated with such access and acknowledge that the platform's availability may be subject to limitations, delays, and other problems inherent in internet-based services.

You agree to comply with all applicable Know Your Customer (KYC) and Anti-Money Laundering (AML) requirements, including providing accurate identity verification documents when requested. Failure to comply may result in account suspension or termination and the withholding of funds pending completion of verification.`
        },
        {
          title: "Investment Risks",
          content: `Copy trading and cryptocurrency investment involve substantial risk of loss and are not suitable for all investors. You acknowledge and agree that cryptocurrency markets are highly volatile and that the value of digital assets can fluctuate significantly over short periods of time. You may lose some or all of your invested capital.

The trading bots available on Cloudbright execute trades automatically based on their own strategies. Past performance of any bot is not indicative of future results. Market conditions can change rapidly, and historical data may not accurately predict future performance. A bot that has been profitable in the past may incur losses in the future.

By copying a bot, you authorize the bot to execute trades with your invested capital. You acknowledge that you have reviewed the bot's transparent performance data before making your investment decision. Cloudbright does not provide investment advice, and the display of bot statistics on our platform should not be construed as a recommendation to copy any particular bot.

You understand that lock-in periods (7 to 180 days) mean your invested capital is committed for the chosen duration. While you can collect realized profits at any time, the principal investment is locked until the period ends. You understand that technical issues, including platform outages or software errors, may temporarily affect your ability to monitor or manage your investments. We recommend that you never invest more than you can afford to lose.`
        },
        {
          title: "Custodial Wallet Terms",
          content: `Cloudbright provides protected custodial wallets for storing your cryptocurrency funds. By using our wallet services, you agree to the following:

Your funds are held in custodial wallets operated and secured by Cloudbright. We employ AES-256 encryption, two-factor authentication (2FA), hardware security modules (HSM), and multi-layer security protocols to protect your assets.

Deposits are credited instantly upon blockchain confirmation. Minimum investment per bot copy is $50 USD equivalent. We support USDT, BTC, ETH, BNB, USDC, SOL, TRX, and other major cryptocurrencies.

Withdrawals of available funds (profits and unlocked capital) are processed according to our standard procedures. Funds locked in active bot copies are not available for withdrawal until the lock-in period expires.

Cloudbright reserves the right to delay or refuse withdrawals in cases of: (a) suspected fraudulent activity; (b) incomplete KYC/AML verification; (c) ongoing compliance investigations; (d) requests from law enforcement or regulatory authorities; or (e) technical issues requiring resolution. We will notify you of any such delays and the reasons therefor.`
        },
        {
          title: "Intellectual Property",
          content: `All content, features, and functionality on the Cloudbright platform, including but not limited to text, graphics, logos, images, software, trading algorithms, bot analytics tools, and the compilation thereof, are the exclusive property of HONG KONG CLOUD BRIGHT SOFTWARE LIMITED or our licensors and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

You are granted a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the platform solely for your personal, non-commercial use in accordance with these Terms. This license does not include any right to: (a) resell or make commercial use of the platform or its content; (b) scrape, collect, or extract bot performance data for external use; (c) make derivative uses of the platform or its content; (d) download or copy account information for the benefit of another party; or (e) use any data mining, robots, or similar data gathering tools.

The Cloudbright name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of HONG KONG CLOUD BRIGHT SOFTWARE LIMITED or its affiliates. You may not use such marks without our prior written permission.`
        },
        {
          title: "Limitation of Liability",
          content: `To the maximum extent permitted by applicable law, HONG KONG CLOUD BRIGHT SOFTWARE LIMITED, its affiliates, officers, directors, employees, agents, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from: (a) your access to or use of or inability to access or use the platform; (b) the performance or non-performance of any copied trading bot; (c) any content obtained from the platform, including bot statistics and performance data; (d) unauthorized access, use, or alteration of your transmissions or content; or (e) investment losses of any kind arising from copy trading.

In no event shall the aggregate liability of HONG KONG CLOUD BRIGHT SOFTWARE LIMITED for all claims relating to the platform exceed the greater of one hundred U.S. dollars ($100) or the amount of commissions you paid to Cloudbright in the twelve (12) months preceding the event giving rise to the liability.

The platform and all content, including bot performance statistics and trade data, are provided "as is" and "as available" without warranties of any kind, either express or implied. Cloudbright does not warrant that any bot will be profitable, that the platform will be uninterrupted, or that bot statistics will be error-free.

Some jurisdictions do not allow the exclusion of certain warranties or the limitation of liability for incidental or consequential damages. Accordingly, some of the limitations set forth above may not apply to you.`
        },
        {
          title: "Termination",
          content: `Cloudbright reserves the right to suspend or terminate your account and access to the platform at any time, with or without cause, for any reason including but not limited to: (a) violation of these Terms or any applicable law; (b) fraudulent or abusive behavior; (c) failure to complete required KYC/AML verification; (d) suspected money laundering or other illegal activity; (e) extended periods of inactivity; or (f) requests by law enforcement or government agencies.

Upon termination, your right to use the platform will immediately cease. Active bot copies will be stopped, and any locked funds will be released after the lock-in period expires or as required by applicable law. Cloudbright reserves the right to withhold funds if required to comply with legal obligations or ongoing investigations.

You may terminate your account at any time by following the account closure procedures on the platform or by contacting support. Upon voluntary termination, active bot copies will be stopped. Funds in locked periods will be released upon lock-in expiry. You remain responsible for any obligations incurred prior to termination.

All provisions of these Terms that by their nature should survive termination shall survive, including without limitation intellectual property rights, limitation of liability, and dispute resolution provisions.`
        },
        {
          title: "Governing Law",
          content: `These Terms shall be governed by and construed in accordance with the laws of the Hong Kong Special Administrative Region, without regard to its conflict of law provisions.

You agree that any legal action or proceeding between you and Cloudbright shall be brought exclusively in the courts of Hong Kong. You hereby consent to and waive all defenses of lack of personal jurisdiction and forum non conveniens with respect to venue and jurisdiction in such courts.

Nothing in these Terms shall affect any non-waivable statutory rights that apply to you. If you are a consumer in the European Union, you will benefit from any mandatory provisions of the law of the country in which you are resident.

In the event of any conflict between these Terms and any applicable local consumer protection laws, the provisions which provide greater protection to consumers shall prevail. Any clause declared invalid shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.`
        },
        {
          title: "Changes to Terms",
          content: `Cloudbright reserves the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on the platform with a new "Last Updated" date, and in certain circumstances, we may provide additional notice such as email notification or a prominent notice on the platform.

Your continued use of the platform following the posting of revised Terms means that you accept the changes. If you do not agree to the modified Terms, you must stop using the platform and close your account.

Material changes will be effective upon posting or such later date as specified. Non-material changes take effect immediately upon posting. We encourage you to review these Terms regularly.`
        },
        {
          title: "Contact Information",
          content: `If you have any questions, concerns, or complaints regarding these Terms of Service or the Cloudbright platform, please contact us:

Email: legal@cloudbright.com
Company: HONG KONG CLOUD BRIGHT SOFTWARE LIMITED

For general support inquiries, contact our support team through the help center on the platform. We strive to respond to all inquiries within 48 business hours.

For legal notices, including notices of claimed copyright infringement, please send correspondence to our legal department at the email address above. All legal notices must be in writing.

These Terms constitute the entire agreement between you and HONG KONG CLOUD BRIGHT SOFTWARE LIMITED regarding your use of the platform and supersede all prior and contemporaneous understandings, agreements, representations, and warranties regarding such subject matter.`
        }
      ]}
    />
  );
}
