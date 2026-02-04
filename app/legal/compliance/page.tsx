'use client';

import LegalPage from '@/components/LegalPage';

export default function CompliancePolicy() {
  return (
    <LegalPage
      title="Compliance Policy"
      lastUpdated="December 29, 2024"
      effectiveDate="January 1, 2025"
      sections={[
        {
          title: "Regulatory Framework",
          content: `Celestian Limited is committed to operating our AI-powered cryptocurrency trading platform in full compliance with all applicable laws, regulations, and industry standards. This Compliance Policy outlines our commitment to regulatory compliance, describes our compliance framework, and explains the measures we take to ensure adherence to legal and regulatory requirements across all jurisdictions where we operate.

Our compliance program is designed to address the complex and evolving regulatory landscape for cryptocurrency and digital asset services. We recognize that cryptocurrency businesses operate in a highly regulated environment subject to financial services regulations, anti-money laundering (AML) laws, counter-terrorism financing (CTF) requirements, data protection and privacy laws, consumer protection regulations, and securities laws where applicable.

We maintain a comprehensive compliance framework that includes written policies and procedures, regular risk assessments, ongoing monitoring and surveillance, employee training and awareness programs, independent compliance audits, and engagement with regulatory authorities. Our compliance program is overseen by a dedicated compliance officer who reports directly to senior management and has the authority and resources necessary to implement effective compliance controls.

Celestian commits to adapting our compliance program in response to regulatory developments, emerging risks, and best practices in the cryptocurrency industry. We actively monitor regulatory developments in all jurisdictions where we operate and engage with legal and compliance advisors to ensure our understanding and implementation of regulatory requirements remains current. We also participate in industry associations and regulatory dialogue to contribute to the development of appropriate regulatory frameworks for cryptocurrency services.`
        },
        {
          title: "AML/KYC Procedures",
          content: `Celestian has implemented a comprehensive Anti-Money Laundering (AML) and Know Your Customer (KYC) program in accordance with the Financial Action Task Force (FATF) recommendations, the Bank Secrecy Act (BSA), regulations promulgated by the Financial Crimes Enforcement Network (FinCEN), and other applicable AML laws and regulations. Our AML/KYC program is designed to prevent our platform from being used for money laundering, terrorism financing, or other illicit activities.

Our AML/KYC program includes several key components: (a) Customer Identification Program (CIP) that collects and verifies customer identity information; (b) Customer Due Diligence (CDD) to understand the nature and purpose of customer relationships and develop customer risk profiles; (c) Enhanced Due Diligence (EDD) for high-risk customers, including politically exposed persons (PEPs) and customers from high-risk jurisdictions; (d) Ongoing monitoring of customer transactions to identify suspicious activity; (e) Suspicious Activity Reporting to relevant authorities when required; and (f) Record keeping and retention of all identification documents and transaction records.

We employ a risk-based approach to AML/KYC compliance, which means we apply more stringent measures to customers and transactions that present higher money laundering or terrorism financing risks. Risk factors we consider include geographic location, transaction patterns and volumes, source of funds, nature of business or occupation, use of anonymity-enhanced cryptocurrencies, and relationships with high-risk jurisdictions or entities.

Our platform utilizes advanced technology solutions to support our AML/KYC program, including automated identity verification systems, blockchain analytics tools to trace cryptocurrency transactions and identify potentially suspicious activity, transaction monitoring systems that flag unusual patterns, screening against sanctions lists and PEP data sources, and artificial intelligence tools to detect complex money laundering schemes. These technological tools are complemented by human review and investigation of flagged transactions and customers.`
        },
        {
          title: "Know Your Customer",
          content: `Our Know Your Customer (KYC) procedures are fundamental to our compliance program and are designed to ensure we know who our customers are, understand the nature of their activities, and can assess the money laundering and terrorism financing risks they present. All customers must complete our KYC verification process before they can access the full functionality of our platform, particularly before making deposits or conducting trades.

During the account registration process, we collect identifying information from customers including full legal name, date of birth, residential address, nationality and country of residence, email address and phone number, and occupation or source of funds. For individual customers, we require government-issued photo identification such as a passport, driver's license, or national identity card. For business or institutional customers, we require additional documentation including corporate registration documents, beneficial ownership information, and identification of authorized representatives.

We verify the information provided by customers using reliable, independent sources. For individual customers, this typically involves document verification where we authenticate the government-issued ID using advanced verification technology, liveness checks to confirm the individual is physically present during verification, facial comparison to match the customer's appearance to their ID photo, and address verification through utility bills, bank statements, or other official documents. The verification process may be completed through automated systems for straightforward cases or may require manual review for more complex situations.

For enhanced due diligence cases, such as high-net-worth individuals, customers from high-risk jurisdictions, or customers engaged in high-volume trading, we may request additional information including proof of source of funds or source of wealth, detailed information about the purpose and intended nature of the business relationship, documentation of business activities or employment, and information about expected transaction volumes and patterns. We reserve the right to request additional information from any customer at any time to maintain the integrity of our KYC program.

Customers must update their KYC information when there are material changes to their circumstances, and we periodically re-verify customer information to ensure our records remain current. Failure to maintain current KYC information may result in restrictions on account functionality or account suspension until updated information is provided and verified.`
        },
        {
          title: "Anti-Money Laundering",
          content: `Celestian maintains a robust Anti-Money Laundering (AML) program to detect and prevent the use of our platform for money laundering activities. Money laundering is the process of concealing the origins of illegally obtained money, typically by passing it through a complex sequence of banking transfers or commercial transactions to make it appear legitimate. Our AML program is designed to identify and report suspicious activities that may indicate money laundering or other financial crimes.

Our AML program includes continuous transaction monitoring using sophisticated automated systems that analyze customer transactions in real-time and flag potentially suspicious activity based on various risk indicators. Red flags that may trigger additional review include: unusually large or frequent transactions inconsistent with the customer's profile; rapid movement of funds through the platform (deposits followed quickly by withdrawals); transactions involving high-risk jurisdictions or sanctioned entities; use of multiple accounts or attempts to structure transactions to avoid reporting thresholds; transactions with no apparent economic purpose; and patterns consistent with known money laundering typologies.

When our monitoring systems flag potentially suspicious activity, our compliance team conducts a detailed investigation to determine whether the activity is legitimate or warrants further action. This investigation may include reviewing the customer's account history and transaction patterns, researching the customer's background and business activities, requesting additional information or documentation from the customer, analyzing blockchain data to trace the source and destination of funds, and consulting with external data sources and investigative resources.

If our investigation determines that activity is suspicious and may involve money laundering or other financial crimes, we are required to file a Suspicious Activity Report (SAR) with FinCEN and/or other relevant financial intelligence units, depending on jurisdiction. We file SARs in accordance with regulatory timeframes and requirements, and we may not inform customers that a SAR has been filed, as doing so could constitute illegal "tipping off" under AML regulations. We maintain detailed records of all SARs and the underlying investigations.

Our AML program also includes robust record-keeping requirements. We maintain records of all customer identification information, transaction records, correspondence with customers, internal investigations and reviews, and SARs filed, for at least five years or such longer period as required by applicable law. These records are securely stored and accessible to compliance personnel and regulators as needed.`
        },
        {
          title: "Sanctions Compliance",
          content: `Celestian strictly complies with international sanctions programs administered by various governmental authorities, including the U.S. Department of the Treasury's Office of Foreign Assets Control (OFAC), the United Nations Security Council, the European Union, the United Kingdom's Office of Financial Sanctions Implementation (OFSI), and other relevant sanctions authorities. Our sanctions compliance program is designed to prevent transactions with sanctioned individuals, entities, or jurisdictions.

We maintain screening procedures to ensure we do not provide services to sanctioned parties or facilitate prohibited transactions. All customers are screened against sanctions lists during the account registration and verification process, including: OFAC's Specially Designated Nationals and Blocked Persons List (SDN List); OFAC's Consolidated Sanctions List; UN Security Council Consolidated List; EU Consolidated Sanctions List; UK Consolidated List of Financial Sanctions Targets; and other applicable sanctions and watch lists. Screening is conducted using specialized sanctions screening software that matches customer information against comprehensive sanctions data sources.

In addition to initial screening during onboarding, we conduct ongoing sanctions screening of existing customers. Sanctions lists are updated regularly as new designations are announced, and we screen our customer base against updated lists to identify any matches. We also monitor customer transactions to identify potential sanctions violations, such as transactions involving cryptocurrency addresses associated with sanctioned entities or transactions that may involve sanctioned jurisdictions.

If a customer or transaction is identified as matching or potentially matching a sanctions list entry, we immediately block the account and/or transaction pending further review. Our compliance team conducts a detailed investigation to determine whether a true match exists or whether it is a false positive. If a true match is confirmed, we are prohibited from processing the transaction or providing services to that customer, and we must report the blocked transaction to relevant authorities in accordance with regulatory requirements.

We prohibit the use of our platform by customers located in or organized under the laws of comprehensively sanctioned jurisdictions, including countries subject to comprehensive OFAC sanctions. We implement geographic IP address blocking and other technical controls to prevent access from sanctioned jurisdictions, though we recognize that determined actors may attempt to circumvent these controls using VPNs or other means. Customers are prohibited from using VPNs or similar tools to evade our geographic restrictions, and doing so constitutes a material breach of our Terms of Service.`
        },
        {
          title: "Reporting Obligations",
          content: `As part of our comprehensive compliance program, Celestian fulfills various reporting obligations to regulatory authorities and law enforcement agencies. These reporting requirements are critical to the global effort to combat financial crime and ensure transparency in financial transactions. We take our reporting obligations seriously and have implemented systems and procedures to ensure timely and accurate reporting.

Our primary reporting obligations include filing Suspicious Activity Reports (SARs) with FinCEN when we detect transactions or patterns of activity that may indicate money laundering, terrorism financing, fraud, or other criminal activity. SARs must be filed within specific timeframes (generally within 30 days of initial detection for continuing activity) and must include detailed information about the suspicious activity, the parties involved, and our analysis of why the activity is suspicious.

We also file Currency Transaction Reports (CTRs) when required for transactions involving currency (or cryptocurrency equivalent) exceeding certain thresholds. Although specific CTR requirements for cryptocurrency transactions are evolving, we apply similar reporting standards to ensure compliance as regulations develop. We maintain detailed records of all reportable transactions to support our reporting obligations.

For international transactions and relationships, we may be subject to additional reporting requirements under various international regulatory frameworks, including information exchange programs between financial intelligence units, tax information reporting under FATCA (Foreign Account Tax Compliance Act) and CRS (Common Reporting Standard), and regulatory reporting to securities regulators or other financial supervisory authorities where applicable.

We respond to lawful requests for information from law enforcement, regulatory authorities, and other government agencies. When we receive a subpoena, court order, search warrant, or other formal legal request for customer information or transaction data, we carefully review the request to ensure it is legally valid and appropriately scoped, and we provide the requested information in accordance with applicable law while protecting customer privacy to the extent legally permissible.

Celestian maintains detailed records to support our reporting obligations and to demonstrate compliance with regulatory requirements. These records include copies of all reports filed with authorities, documentation of internal investigations and reviews, communications with regulatory authorities, training records demonstrating that staff are educated on reporting obligations, and audit trails of system access and report generation. Records are retained for at least five years or such longer period as required by applicable law or regulation.`
        },
        {
          title: "Data Protection",
          content: `Celestian is committed to protecting customer data and personal information in accordance with applicable data protection and privacy laws, including the European Union's General Data Protection Regulation (GDPR), the UK Data Protection Act 2018, the California Consumer Privacy Act (CCPA), and other applicable privacy regulations. Our data protection practices are detailed in our Privacy Policy, which should be read in conjunction with this Compliance Policy.

We implement the principle of "privacy by design" in our platform and operations, meaning that data protection considerations are integrated into our systems and processes from the outset rather than added as an afterthought. This includes minimizing the collection of personal data to what is necessary for our legitimate business purposes and regulatory obligations, implementing appropriate technical and organizational security measures to protect data, ensuring data accuracy and keeping data up to date, limiting data retention to what is necessary for legal and business purposes, and ensuring transparency about our data practices.

For customers in the European Economic Area, UK, and other jurisdictions with comprehensive data protection laws, we serve as the data controller for personal information we collect and process. We provide customers with clear information about what data we collect, how we use it, who we share it with, and the legal basis for processing. We respect data subject rights including rights of access, rectification, erasure, restriction of processing, data portability, and objection to processing.

We implement robust data security measures to protect personal information from unauthorized access, use, disclosure, alteration, or destruction. These measures include encryption of data in transit and at rest, access controls and authentication mechanisms, regular security assessments and penetration testing, incident response procedures, employee training on data protection, and vendor management to ensure third-party service providers maintain appropriate security standards. Despite these measures, we acknowledge that no security is perfect, and we maintain incident response procedures to address any data breaches promptly and in accordance with regulatory notification requirements.

Cross-border data transfers are subject to strict requirements under many data protection laws. When we transfer personal data from the EEA or UK to other jurisdictions, we implement appropriate safeguards such as Standard Contractual Clauses (SCCs) approved by the European Commission, adequacy decisions, or other legally recognized transfer mechanisms. We conduct transfer impact assessments to ensure adequate protection for transferred data and implement supplementary measures where necessary.`
        },
        {
          title: "Audits and Monitoring",
          content: `Celestian maintains a comprehensive program of audits, monitoring, and testing to ensure the effectiveness of our compliance program and identify areas for improvement. Our audit and monitoring activities include both ongoing monitoring integrated into our daily operations and periodic comprehensive reviews of our compliance framework, policies, procedures, and controls.

Internal monitoring activities include real-time transaction monitoring through automated systems that flag potentially suspicious activity, periodic reviews of high-risk customer accounts and transactions, quality assurance reviews of customer onboarding and KYC verification processes, monitoring of employee activities and access to sensitive systems and data, and testing of technical controls such as sanctions screening systems and geographic restrictions.

We conduct regular internal audits of our compliance program to assess effectiveness and identify deficiencies. These audits are performed by personnel independent of the functions being audited and cover all critical compliance areas including AML/KYC procedures and record-keeping, sanctions compliance screening and blocking procedures, data protection and privacy controls, transaction monitoring and suspicious activity detection, employee training and awareness, and incident response and reporting procedures. Audit findings are documented, and corrective action plans are developed and implemented to address identified deficiencies.

In addition to internal audits, we engage independent third-party auditors to conduct periodic reviews of our compliance program. External audits provide an objective assessment of our compliance framework and help ensure we are meeting industry standards and regulatory expectations. Third-party auditors may include legal and compliance consultants, cybersecurity firms, and specialized blockchain analytics providers. We consider recommendations from external auditors and implement changes to our program as appropriate.

We are subject to regulatory examinations and audits by various government authorities with jurisdiction over our activities. We cooperate fully with regulatory examiners, provide requested information and access to systems and records, respond promptly to regulatory inquiries and findings, and implement corrective actions as required or recommended by regulators. We view regulatory examinations as opportunities to strengthen our compliance program and demonstrate our commitment to regulatory compliance.

All audit findings, whether from internal audits, external audits, or regulatory examinations, are documented and tracked through resolution. Senior management and the board of directors are informed of significant audit findings and the status of corrective actions. We maintain records of all audits, findings, and corrective actions for regulatory review and to demonstrate the ongoing effectiveness of our compliance program.`
        },
        {
          title: "Staff Training",
          content: `Effective compliance depends on knowledgeable and vigilant employees. Celestian maintains a comprehensive compliance training program to ensure all employees understand their compliance obligations, can recognize potential compliance risks, and know how to respond appropriately to compliance issues. Our training program covers all aspects of our compliance framework and is tailored to the specific roles and responsibilities of different employee groups.

All new employees receive compliance training as part of their onboarding process. This initial training covers our compliance policies and procedures, AML/KYC requirements and red flags for suspicious activity, sanctions compliance and screening procedures, data protection and privacy obligations, reporting obligations and how to escalate compliance concerns, and the consequences of compliance failures for both the company and individuals. New employees must complete and pass assessments demonstrating their understanding of compliance requirements before they are granted access to systems and customer data.

We provide ongoing compliance training to all employees on at least an annual basis. Regular training ensures that employees remain aware of their compliance obligations, stay current with changes in regulations and our internal policies, and are reminded of the importance of compliance. Training topics are updated regularly to reflect regulatory developments, emerging risks, new compliance procedures, lessons learned from compliance incidents or near-misses, and industry best practices and evolving typologies of financial crime.

Specialized training is provided to employees in roles with heightened compliance responsibilities, including compliance officers and investigators, customer onboarding and verification teams, customer support personnel who interact with customers, senior management with oversight responsibilities, and technology teams who develop and maintain compliance systems. This specialized training is more detailed and technical, reflecting the specific compliance challenges and responsibilities associated with these roles.

We utilize various training methods to ensure effective learning, including instructor-led training sessions, online learning modules with interactive content, case studies and scenario-based exercises, regular compliance updates and communications, and refresher training on specific topics as needed. We track training completion and maintain records of all training provided to employees, including dates of training, topics covered, and assessment results.

Our training program extends beyond our employees to contractors, vendors, and other third parties who perform services on our behalf or have access to our systems or customer data. We ensure that these parties understand and comply with our compliance requirements through contractual obligations, providing necessary training or compliance guidelines, monitoring their compliance performance, and conducting periodic reviews and audits of their activities.`
        },
        {
          title: "Contact",
          content: `Celestian welcomes questions, concerns, and reports regarding compliance matters. We are committed to maintaining an open dialogue with customers, employees, regulators, and other stakeholders about our compliance program and practices. If you have any compliance-related inquiries or concerns, please contact us through the appropriate channels described below.

For general compliance inquiries, questions about our policies and procedures, or requests for information about our compliance program, please contact our Compliance Department at:
Email: compliance@celestian.ai
Business Name: Celestian Limited

For specific matters related to AML/KYC verification, account restrictions, or requests for documentation, please contact our KYC team at kyc@celestian.ai. For data protection and privacy matters, including requests to exercise your data subject rights under GDPR or other privacy laws, please contact our Data Protection Officer at privacy@celestian.ai.

We maintain a confidential compliance hotline for reporting suspected violations of law, regulations, or our internal policies. This hotline is available to employees, customers, and other parties who wish to report compliance concerns. Reports can be made anonymously where permitted by law, and we prohibit retaliation against anyone who reports compliance concerns in good faith. To report a compliance concern, please email compliance-hotline@celestian.ai or use the secure reporting portal available through our website.

Regulatory authorities and law enforcement agencies may contact us regarding investigations, examinations, or information requests. Official inquiries should be directed to our Legal and Compliance Department at legal@celestian.ai. We will respond promptly to all lawful requests for information and cooperate fully with regulatory and law enforcement investigations.

This Compliance Policy is part of our broader framework of policies and procedures designed to ensure we operate lawfully and ethically. For information about how we handle your personal data, please see our Privacy Policy. For information about the risks of cryptocurrency trading, please see our Risk Disclosure Statement. For the terms governing your use of our platform, please see our Terms of Service. Together, these documents reflect our commitment to transparency, compliance, and customer protection.`
        }
      ]}
    />
  );
}
