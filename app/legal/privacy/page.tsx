'use client';

import LegalPage from '@/components/LegalPage';

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="December 29, 2024"
      effectiveDate="January 1, 2025"
      sections={[
        {
          title: "Information We Collect",
          content: `Celestian Limited is committed to protecting your privacy and personal data. This Privacy Policy describes how we collect, use, store, and share information about you when you use our AI-powered cryptocurrency trading platform and related services.

We collect several types of information from and about users of our platform, including: (a) Personal Identification Information such as your name, email address, postal address, phone number, date of birth, government-issued identification numbers, and other similar contact data; (b) Financial Information including bank account details, cryptocurrency wallet addresses, transaction history, trading activity, and payment card information; (c) Identity Verification Data such as passport or driver's license scans, utility bills, selfies, and biometric data collected during our KYC verification process.

Technical Information is automatically collected when you use our platform, including your IP address, browser type and version, device identifiers, operating system, time zone setting, browser plug-in types and versions, cookie identifiers, location data, and other technology on the devices you use to access the platform. We also collect Usage Data about how you interact with our platform, including pages visited, features used, time spent on pages, trading patterns, AI model preferences, and search queries.

We collect information directly from you when you create an account, complete verification procedures, make transactions, communicate with our support team, or participate in surveys. We also collect information automatically through cookies, server logs, and similar tracking technologies. In some cases, we may receive information about you from third parties such as identity verification services, fraud prevention services, and blockchain analytics providers.`
        },
        {
          title: "How We Use Your Information",
          content: `Celestian uses the information we collect for various purposes essential to providing and improving our services. We process your personal data to create and maintain your account, verify your identity in compliance with KYC/AML regulations, process your transactions and trading activities, provide customer support, and communicate with you about your account and our services.

We use your information to operate and improve our AI-powered trading features, including training and refining our machine learning models, analyzing trading patterns and market trends, personalizing your user experience, and developing new features and services. Technical and usage data helps us monitor and analyze platform performance, detect and prevent fraud and security threats, troubleshoot technical issues, and ensure platform stability and security.

Your data is used to comply with legal and regulatory obligations, including anti-money laundering (AML) laws, counter-terrorism financing (CTF) regulations, tax reporting requirements, and responses to legal processes such as subpoenas or court orders. We may also use your information to enforce our Terms of Service, investigate violations, protect our rights and property, and defend against legal claims.

For marketing purposes, we may use your contact information to send you updates about new features, promotional offers, newsletters, and other communications about our services, but only where we have your consent or are otherwise permitted by law. You have the right to opt out of marketing communications at any time by following the unsubscribe instructions in our emails or adjusting your account preferences.`
        },
        {
          title: "Data Sharing",
          content: `Celestian does not sell your personal information to third parties. However, we may share your information with certain third parties in the following circumstances and under strict confidentiality obligations. We share data with Service Providers who perform services on our behalf, including payment processors, identity verification providers, cloud hosting services, customer support platforms, email service providers, and analytics services. These providers are contractually obligated to use your information only for the purposes we specify and to protect your data.

We may disclose your information to Law Enforcement and Regulatory Authorities when required by law, in response to legal processes, to comply with regulatory requirements, to detect and prevent fraud or security issues, or to protect the rights, property, or safety of Celestian, our users, or the public. This includes cooperation with financial crime prevention agencies, tax authorities, and securities regulators.

In the event of a Business Transfer, such as a merger, acquisition, reorganization, bankruptcy, or sale of assets, your information may be transferred to the successor entity. We will notify you of any such change in ownership or control of your personal information and provide you with choices regarding your data where applicable.

With your explicit consent, we may share your information with third parties for purposes not described in this policy. We may also share anonymized, aggregated, or de-identified data that cannot reasonably be used to identify you with partners for research, analytics, or marketing purposes. When sharing data with third parties, we implement appropriate safeguards through contractual agreements that require recipients to maintain the confidentiality and security of your information.`
        },
        {
          title: "Cookies and Tracking",
          content: `Celestian uses cookies, web beacons, pixel tags, and similar tracking technologies to collect information about your browsing activities on our platform and to enhance your user experience. Cookies are small data files stored on your device that help us recognize you, remember your preferences, understand how you use our platform, and improve our services.

We use several types of cookies: (a) Essential Cookies that are necessary for the platform to function, including authentication cookies that keep you logged in and security cookies that protect against fraudulent activity; (b) Performance Cookies that collect information about how you use our platform, which pages are most popular, and where error messages are delivered; (c) Functionality Cookies that remember your preferences and choices, such as language settings, display preferences, and AI trading parameters; (d) Analytics Cookies that help us understand user behavior, measure platform performance, and identify areas for improvement.

Third-party cookies may be placed on your device by our partners for advertising, analytics, and fraud prevention purposes. These include cookies from services like Google Analytics, which help us understand traffic sources and user demographics, and advertising networks that may display relevant ads based on your interests. For detailed information about the specific cookies we use, please refer to our Cookie Policy.

You can control cookie settings through your browser preferences, and most browsers allow you to refuse or delete cookies. However, blocking certain cookies may impact your ability to use some features of our platform. Some browsers offer "Do Not Track" signals, but there is no industry consensus on how to respond to these signals, so our platform does not currently respond to Do Not Track requests.`
        },
        {
          title: "Data Security",
          content: `Celestian implements comprehensive technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We use industry-standard security protocols, including encryption, secure socket layer (SSL) technology, firewalls, intrusion detection systems, and regular security audits to safeguard your data.

All sensitive data, including personal identification information and financial data, is encrypted both in transit and at rest using advanced encryption standards (AES-256 or higher). Access to personal data is restricted to authorized personnel only, based on the principle of least privilege, and all employees with access to personal data are bound by confidentiality obligations and receive regular security training.

We maintain secure data centers with physical access controls, 24/7 monitoring, redundant systems, and backup procedures to ensure data availability and integrity. Our infrastructure is regularly tested through penetration testing, vulnerability assessments, and security audits conducted by independent third-party security firms. We also implement multi-factor authentication, regular password rotation policies, and session timeout mechanisms to prevent unauthorized account access.

Despite our security measures, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your account credentials and for any activities that occur under your account. If you become aware of any unauthorized access to your account or any security breach, you must immediately notify us at security@celestian.ai so we can take appropriate action.`
        },
        {
          title: "Your Rights",
          content: `Depending on your jurisdiction, you may have certain rights regarding your personal data under applicable data protection laws, including the General Data Protection Regulation (GDPR) for users in the European Economic Area, the California Consumer Privacy Act (CCPA) for California residents, and similar privacy laws worldwide.

You have the right to access your personal data and request a copy of the information we hold about you. You can request this information by contacting us at privacy@celestian.ai, and we will provide it in a structured, commonly used, and machine-readable format within the timeframe required by applicable law, typically within 30 days. You also have the right to rectification, meaning you can request that we correct any inaccurate or incomplete personal data we hold about you.

You have the right to erasure (the "right to be forgotten") in certain circumstances, such as when the data is no longer necessary for the purposes for which it was collected, when you withdraw consent, or when the data has been unlawfully processed. However, this right is not absolute, and we may retain certain information where we have a legal obligation to do so, such as for AML/KYC compliance, tax reporting, or fraud prevention.

Additional rights include: (a) the right to restrict processing of your personal data in certain situations; (b) the right to object to processing based on legitimate interests or for direct marketing purposes; (c) the right to data portability, allowing you to receive your data and transfer it to another service provider; (d) the right to withdraw consent at any time where we rely on consent as the legal basis for processing; and (e) the right to lodge a complaint with a supervisory authority if you believe your data protection rights have been violated.`
        },
        {
          title: "International Transfers",
          content: `Celestian operates globally and may transfer, store, and process your personal information in countries other than your country of residence. These countries may have data protection laws that differ from the laws of your country, and in some cases, may not provide the same level of data protection.

When we transfer personal data from the European Economic Area (EEA) or the United Kingdom to countries outside these regions, we ensure that appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable law. These safeguards may include: (a) transferring data to countries that have been deemed to provide an adequate level of data protection by the European Commission; (b) using Standard Contractual Clauses (SCCs) approved by the European Commission; (c) implementing binding corporate rules; or (d) relying on other legally recognized transfer mechanisms.

For transfers from other jurisdictions, we implement similar appropriate safeguards as required by local data protection laws. We conduct transfer impact assessments to ensure that your data receives an adequate level of protection in the destination country and implement supplementary measures where necessary to address any risks identified.

If you are located in the EEA, UK, or other jurisdictions with data transfer restrictions, you can request more information about the safeguards we use for international data transfers by contacting us at privacy@celestian.ai. We will provide you with information about the relevant safeguard mechanisms and, where applicable, a copy of the Standard Contractual Clauses or other transfer documentation.`
        },
        {
          title: "Children's Privacy",
          content: `The Celestian platform is not intended for use by individuals under the age of 18 years (or the age of majority in your jurisdiction, whichever is higher). We do not knowingly collect, use, or disclose personal information from children under 18. Our Terms of Service explicitly prohibit use of our services by minors, and our registration process includes age verification mechanisms.

If we become aware that we have collected personal information from a child under 18 without verification of parental consent, we will take immediate steps to delete that information from our servers and terminate the associated account. We implement age-gating mechanisms during the account creation process and may request additional verification if we suspect that a user may be under the minimum age requirement.

Parents or legal guardians who believe that their child has provided personal information to Celestian should contact us immediately at privacy@celestian.ai. Upon receiving such notice, we will investigate the matter and, if we determine that we have collected personal information from a child under 18, we will delete such information as quickly as possible and take steps to prevent the child from accessing our services in the future.

The minimum age requirement is in place not only to comply with privacy laws such as the Children's Online Privacy Protection Act (COPPA) in the United States but also due to the sophisticated nature of cryptocurrency trading and the financial risks involved. Cryptocurrency trading requires legal capacity to enter into financial contracts, which minors typically do not possess under most jurisdictions' laws.`
        },
        {
          title: "Policy Changes",
          content: `Celestian reserves the right to modify this Privacy Policy at any time to reflect changes in our practices, legal requirements, or for other operational, legal, or regulatory reasons. When we make changes to this Privacy Policy, we will update the "Last Updated" date at the top of this page and post the revised policy on our platform.

For material changes that significantly affect your rights or how we process your personal data, we will provide additional notice and, where required by law, obtain your consent. This notice may be provided through email to the address associated with your account, a prominent banner on our platform, or through a notification when you log in to your account. Material changes include modifications to the types of data we collect, the purposes for which we use data, or the third parties with whom we share data.

We encourage you to review this Privacy Policy periodically to stay informed about how we collect, use, and protect your information. Your continued use of our platform after the effective date of any changes to this Privacy Policy constitutes your acceptance of those changes. If you do not agree with the modified Privacy Policy, you should discontinue use of our platform and contact us to close your account.

If you have questions about changes to this Privacy Policy or would like to understand how specific changes affect you, please contact our Data Protection Officer at privacy@celestian.ai. We maintain archives of previous versions of our Privacy Policy and can provide you with information about what has changed between versions upon request.`
        }
      ]}
    />
  );
}
