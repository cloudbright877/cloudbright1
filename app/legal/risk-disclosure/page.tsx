'use client';

import LegalPage from '@/components/LegalPage';

export default function RiskDisclosure() {
  return (
    <LegalPage
      title="Risk Disclosure Statement"
      lastUpdated="December 29, 2024"
      effectiveDate="January 1, 2025"
      sections={[
        {
          title: "General Trading Risks",
          content: `This Risk Disclosure Statement is provided by Celestian Limited to inform you of the significant risks associated with trading cryptocurrencies and digital assets on our AI-powered platform. Trading cryptocurrencies involves substantial risk of loss and is not suitable for all investors. You should carefully consider whether trading is appropriate for you in light of your experience, objectives, financial resources, and other relevant circumstances.

Cryptocurrency trading is a highly speculative activity that can result in the loss of your entire investment. The value of digital assets can and does fluctuate significantly, and any individual cryptocurrency may become worthless. Past performance is not indicative of future results, and no representation is being made that the use of our AI-powered trading tools or any trading strategy will guarantee profits or prevent losses.

This Risk Disclosure does not disclose all the risks and other significant aspects of trading cryptocurrencies. You should not engage in cryptocurrency trading unless you understand the nature of the transactions you are entering into and the extent of your exposure to loss. You should carefully consider whether such trading is suitable for you in light of your circumstances, knowledge, and financial resources. You may sustain losses in excess of your initial investment.

By using the Celestian platform and engaging in cryptocurrency trading, you acknowledge that you have read and understood this Risk Disclosure Statement, that you are aware of the risks involved in cryptocurrency trading, and that you are willing to accept these risks. If you do not understand any aspect of this disclosure or if you have any questions, you should seek independent professional advice before using our services.`
        },
        {
          title: "Cryptocurrency Volatility",
          content: `Cryptocurrencies are subject to extreme price volatility, with values that can fluctuate dramatically within very short time periods, sometimes within minutes or even seconds. Price movements of 10%, 20%, or more in a single day are not uncommon in cryptocurrency markets, and even larger swings can occur during periods of market stress or significant news events. This volatility can result in substantial gains but also in rapid and severe losses.

The volatile nature of cryptocurrency markets is driven by numerous factors, many of which are unpredictable and beyond anyone's control. These factors include: changes in supply and demand dynamics; investor sentiment and speculation; news and social media coverage; regulatory announcements and legal developments; technological changes and security incidents; market manipulation and coordinated trading activities; macroeconomic factors and traditional market movements; and the actions of large holders ("whales") who can significantly impact prices through their trading decisions.

Unlike traditional financial markets, cryptocurrency markets operate 24/7 without trading halts or circuit breakers to pause trading during extreme volatility. This means that significant price movements can occur at any time, including when you may not be actively monitoring your positions. While our AI-powered tools attempt to identify favorable trading opportunities and manage risk, they cannot predict or prevent sudden market movements.

The high volatility of cryptocurrency markets means that the value of your holdings can decrease significantly in a very short period, potentially resulting in substantial losses that exceed your initial investment, especially when using leverage. You should never invest more than you can afford to lose, and you should be prepared for the possibility that your investment could lose all of its value. We strongly recommend that you regularly monitor your positions and maintain adequate risk management practices.`
        },
        {
          title: "Market Risk",
          content: `Market risk refers to the possibility that you will experience losses due to factors that affect the overall performance of cryptocurrency markets. Cryptocurrency markets are relatively young, less regulated, and less established than traditional financial markets, which contributes to their higher risk profile and susceptibility to various market-wide risks.

Cryptocurrency markets can experience significant systemic events that affect multiple assets simultaneously. These events may include regulatory crackdowns in major jurisdictions, security breaches affecting major exchanges or blockchain networks, technological failures or protocol vulnerabilities, macroeconomic events affecting risk appetite globally, or coordinated market manipulation schemes. During such events, diversification across different cryptocurrencies may provide limited protection as correlations between assets tend to increase during market stress.

The relatively small size and lower liquidity of cryptocurrency markets compared to traditional financial markets make them more susceptible to manipulation and artificial price movements. Large traders or groups of traders can potentially influence prices through coordinated buying or selling, spreading misinformation, or engaging in manipulative trading practices such as spoofing, wash trading, or pump-and-dump schemes. Such manipulation can result in prices that do not reflect genuine supply and demand.

Market infrastructure risks are also significant in the cryptocurrency ecosystem. The markets rely on exchanges, wallet providers, blockchain networks, and other infrastructure that may be subject to technical failures, security breaches, regulatory actions, or insolvency. The failure of any major piece of market infrastructure can have cascading effects throughout the ecosystem and may prevent you from accessing your assets or executing trades when needed. Celestian cannot guarantee the reliability or solvency of any third-party infrastructure we integrate with.`
        },
        {
          title: "Liquidity Risk",
          content: `Liquidity risk refers to the risk that you may not be able to buy or sell cryptocurrencies quickly enough at a reasonable price. While major cryptocurrencies like Bitcoin and Ethereum generally have relatively high liquidity, many other digital assets have limited liquidity, and even major cryptocurrencies can experience significant liquidity constraints during periods of market stress or in certain market conditions.

Low liquidity can manifest in several ways that negatively impact your trading: wide bid-ask spreads that increase your trading costs; price slippage where your order is executed at a significantly different price than expected; difficulty exiting positions, especially for large orders; delayed order execution or partial fills; and increased price volatility due to the impact of individual trades on the market price.

During periods of extreme market stress, liquidity can evaporate rapidly as market participants rush to exit positions simultaneously. This can result in "flash crashes" where prices drop precipitously in a very short time, or "liquidity crises" where it becomes extremely difficult or impossible to execute trades at any price. Our AI trading algorithms attempt to assess liquidity conditions, but they cannot guarantee execution at desired prices or predict sudden liquidity shocks.

Certain trading strategies, particularly those involving less popular cryptocurrencies or large position sizes, are especially vulnerable to liquidity risk. If you hold a large position relative to the market's trading volume, attempting to exit that position may significantly move the market price against you, resulting in substantial slippage and losses. Additionally, some cryptocurrencies may have such limited liquidity that it is effectively impossible to exit a position without accepting a substantial loss.`
        },
        {
          title: "Technology Risk",
          content: `Cryptocurrency trading relies heavily on complex technology infrastructure, including blockchain networks, cryptocurrency exchanges, trading platforms, internet connectivity, and various software systems. These technologies are subject to numerous risks that can result in loss of access to your assets, failed transactions, or financial losses.

Blockchain technology risks include the possibility of network congestion that delays or prevents transaction processing, protocol vulnerabilities that could be exploited by attackers, consensus failures or blockchain splits (forks) that create uncertainty about asset ownership, smart contract bugs that could result in loss of funds, and the risk that a particular blockchain network could fail or be abandoned. While blockchains are designed to be secure and decentralized, they are not immune to technical problems or attacks.

Exchange and platform risks are significant in the cryptocurrency ecosystem. Exchanges and trading platforms, including Celestian, may experience technical outages, system failures, cyber attacks, software bugs, or other technical problems that prevent you from accessing your account, viewing your positions, or executing trades. During periods of high volatility and trading volume, platforms may become overloaded and unresponsive, potentially preventing you from managing your positions when it is most critical to do so.

Our AI-powered trading features depend on sophisticated algorithms and machine learning models that, despite rigorous testing, may contain errors or behave in unexpected ways under certain market conditions. AI models are trained on historical data and may not accurately predict future market behavior, especially during unprecedented events or rapidly changing market conditions. Technical glitches in our AI systems could result in unintended trades, incorrect position sizing, or failure to execute intended trading strategies.

Cybersecurity risks are inherent in any online platform. Despite implementing industry-standard security measures, no system is entirely secure against determined attackers. Risks include hacking attempts targeting user accounts or platform infrastructure, phishing attacks designed to steal credentials, malware that compromises user devices, distributed denial-of-service (DDoS) attacks that disrupt platform availability, and insider threats from malicious actors. You should implement strong security practices including using unique, strong passwords, enabling two-factor authentication, and securing your devices.`
        },
        {
          title: "Regulatory Risk",
          content: `The regulatory environment for cryptocurrencies and digital assets is rapidly evolving and varies significantly across jurisdictions. Regulatory uncertainty and the potential for adverse regulatory developments pose substantial risks to cryptocurrency investments and trading activities. Changes in laws or regulations, or new interpretations of existing laws, could negatively impact the value of cryptocurrencies or your ability to access or trade them.

Governments and regulatory authorities worldwide are actively considering or implementing regulations that could significantly affect cryptocurrency markets. Potential regulatory actions include: outright bans on cryptocurrency trading or ownership; restrictions on cryptocurrency exchanges or service providers; requirements for licensing, registration, or compliance that could limit available services; taxation of cryptocurrency transactions or holdings; restrictions on the use of cryptocurrencies for payments; requirements for enhanced KYC/AML procedures; and regulations specifically targeting certain types of cryptocurrencies or trading activities.

Regulatory actions in major jurisdictions can have immediate and significant impacts on cryptocurrency prices and market liquidity. Announcements of potential regulatory crackdowns have historically caused sharp price declines, and actual implementation of restrictive regulations could result in even more severe market disruptions. Additionally, if Celestian or our service providers are required to comply with new regulations, we may need to modify our services, restrict access for users in certain jurisdictions, or cease operations entirely.

The classification of specific cryptocurrencies under existing laws is often unclear. In the United States, for example, there is ongoing debate about whether certain cryptocurrencies should be classified as securities, commodities, or some other category, with significant implications for their regulation. If a cryptocurrency you hold is determined to be a security or subject to other regulatory requirements, it could become illegal to trade, result in delisting from exchanges, or face other restrictions that severely impact its value and liquidity.

Tax treatment of cryptocurrency transactions is complex and varies by jurisdiction. You are solely responsible for understanding and complying with tax obligations in your jurisdiction, including reporting requirements and payment of taxes on cryptocurrency gains. Tax laws regarding cryptocurrencies are evolving, and changes in tax treatment could increase your tax burden or create unexpected tax liabilities for past transactions.`
        },
        {
          title: "Leverage Risk",
          content: `Leverage allows you to open trading positions larger than your account balance by borrowing funds, potentially amplifying both gains and losses. While leverage can increase potential returns, it also substantially increases risk and can result in the loss of your entire account balance and potentially more. Leveraged trading is highly speculative and is not suitable for all investors.

When you trade with leverage, a relatively small adverse price movement can result in substantial losses. For example, with 10x leverage, a 10% adverse price movement would result in a 100% loss of your initial position, while a 5% adverse movement would result in a 50% loss. Higher leverage ratios magnify this effect even further. In volatile cryptocurrency markets, such price movements can occur very quickly, potentially resulting in rapid and severe losses.

Leveraged positions are subject to liquidation if the market moves against you and your account equity falls below the required maintenance margin level. Liquidation means that your position is automatically closed by the platform to prevent further losses, often at unfavorable prices during volatile market conditions. Once liquidated, you cannot recover those losses even if the market subsequently moves in your favor. In extreme cases of very rapid adverse price movements, liquidation may occur at a price that results in a negative account balance, meaning you could lose more than your initial investment.

Leveraged trading incurs additional costs beyond normal trading fees, including interest charges on borrowed funds and potential funding rates in perpetual contract markets. These costs accumulate over time and can be substantial for positions held over extended periods, eating into your potential profits or exacerbating your losses. During periods of market stress, borrowing costs may increase significantly.

Our AI trading features may utilize leverage in their strategies, and while they are designed to manage risk, they cannot eliminate the inherent risks of leveraged trading. Leverage should only be used by experienced traders who fully understand the risks and have the financial capacity to bear substantial losses. We strongly recommend that inexperienced traders avoid leveraged trading or use only minimal leverage with funds they can afford to lose.`
        },
        {
          title: "No Guaranteed Returns",
          content: `There are no guaranteed returns in cryptocurrency trading, and you should be highly skeptical of any person, platform, or strategy that promises or guarantees specific returns, consistent profits, or protection from losses. Cryptocurrency markets are inherently unpredictable, and all trading involves risk of loss, including the potential loss of your entire investment.

Our AI-powered trading features are designed to identify potential trading opportunities based on analysis of market data, technical indicators, historical patterns, and machine learning models. However, these tools cannot predict the future with certainty, and there is no guarantee that they will generate profits or prevent losses. Market conditions can change rapidly in ways that were not anticipated by historical data or current market analysis.

The performance of AI trading algorithms depends on numerous factors, many of which are beyond our control or prediction. These factors include unprecedented market events, changes in market structure or participant behavior, data quality issues, evolving market conditions that differ from the training data, and fundamental limitations in the ability to predict complex systems. Even sophisticated AI models can fail to anticipate "black swan" events or other scenarios that fall outside their training experience.

Any examples, testimonials, or historical performance data provided on our platform are for illustrative purposes only and do not constitute a guarantee or prediction of future results. Individual results will vary based on numerous factors including market conditions during your trading period, your specific trading parameters and risk tolerance, the amount of capital deployed, and timing of entries and exits. Past performance, whether of our AI models or of cryptocurrency assets themselves, is not indicative of future results.

You should approach cryptocurrency trading with realistic expectations and a clear understanding that losses are a normal part of trading. Professional traders typically experience losses on a significant portion of their trades and rely on risk management to ensure that losing trades do not eliminate their capital. You should never invest money that you cannot afford to lose, and you should not expect or rely on cryptocurrency trading as a source of guaranteed income or wealth.`
        },
        {
          title: "Past Performance",
          content: `Past performance is not indicative of future results. Historical returns, whether of specific cryptocurrencies, trading strategies, or our AI models, should not be relied upon as an indication of future performance. The cryptocurrency markets are dynamic and constantly evolving, and conditions that led to past performance may not recur.

When evaluating historical performance data, you should be aware of several important limitations and potential biases. Survivorship bias occurs when performance data only includes assets or strategies that have survived until the present, excluding those that failed, resulting in an overly optimistic view of historical returns. Backtesting bias can occur when trading strategies are optimized using historical data, potentially resulting in strategies that appear profitable historically but fail in live trading due to overfitting to past market conditions.

The cryptocurrency market itself has evolved significantly over its relatively short history, with changes in market structure, participant composition, liquidity, regulation, and technological infrastructure. Strategies or approaches that were successful in earlier market conditions may not work in current or future market environments. Additionally, as more traders adopt similar strategies or AI-powered tools, the effectiveness of those approaches may diminish due to increased competition.

Historical volatility and return characteristics may not be representative of future market behavior. The cryptocurrency market has experienced periods of extremely high returns followed by severe drawdowns, and future market cycles may have different characteristics. Relying on expectations based on past market performance, such as expecting similar returns to previous bull markets, can lead to disappointment and poor decision-making.

When we present historical performance data for our AI models or trading strategies, such data represents how those strategies would have performed historically, not how they actually did perform in live trading. Backtested results do not account for real-world factors such as execution slippage, market impact of trades, liquidity constraints, system downtime, or the psychological factors that affect live trading. Actual results in live trading may differ significantly from backtested results, and there is no guarantee that strategies that performed well historically will continue to do so in the future.`
        },
        {
          title: "Professional Advice",
          content: `Celestian Limited does not provide investment advice, financial advice, tax advice, or legal advice. The information, tools, and services provided on our platform are for informational and trading execution purposes only and should not be construed as recommendations to buy, sell, or hold any particular cryptocurrency or to pursue any particular investment strategy.

You should not make any investment decision without first conducting your own research and analysis and, where appropriate, consulting with qualified professional advisors. Qualified professionals may include financial advisors, investment advisors, tax professionals, and legal counsel who are familiar with your specific circumstances, objectives, and risk tolerance, as well as the specific legal and tax considerations in your jurisdiction.

Cryptocurrency trading and investment involves complex financial, legal, and tax considerations that vary depending on your jurisdiction, financial situation, and other individual circumstances. The suitability of cryptocurrency trading for you depends on numerous factors that only you and your professional advisors can properly evaluate. These factors include your financial goals and objectives, your time horizon, your risk tolerance, your overall financial situation including income and assets, your investment experience and knowledge, and your tax situation.

Our AI-powered trading tools and features are designed to assist you in executing your own trading decisions, not to provide investment advice or make investment decisions on your behalf. While these tools analyze market data and identify potential trading opportunities, you remain solely responsible for all trading decisions made through your account. You should carefully review and understand any trades suggested by AI features before executing them and should not blindly follow AI recommendations without understanding the rationale and risks.

If you are uncertain about the risks of cryptocurrency trading, whether cryptocurrency trading is appropriate for your circumstances, the tax implications of cryptocurrency transactions, or any other aspect of using our services, you should seek independent professional advice before proceeding. The risks outlined in this Risk Disclosure Statement are not exhaustive, and there may be additional risks specific to your situation or to particular cryptocurrencies or trading strategies. Professional advisors can help you understand these risks and make informed decisions.

By using the Celestian platform, you acknowledge that you are making independent investment decisions and that you are solely responsible for evaluating the merits and risks of any trading activities. You agree that Celestian Limited, its officers, directors, employees, and affiliates shall not be liable for any trading losses or adverse consequences resulting from your use of our platform or reliance on any information or tools provided therein.`
        }
      ]}
    />
  );
}
