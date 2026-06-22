/* eslint-disable max-len */
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';
import { userSelectors } from '../../redux/selectors';
import router from '../../router';
import styles from './styles.module.scss';

const NEWS = [
  {
    title: 'Welcome to Liberland blockchain',
    date: 'Feb 12, 2025',
    author: 'Liberland',
    text: `Liberland is the young new country located on a 7km² island on the Danube river.
The country is founded on the principles of Libertarianism and blockchain governance.
Welcome to the official dApp of Liberland. Here, you can:
- [Handle finances and get deFi services](https://blockchain.liberland.org/home/wallet/overview)
- [Browse Liberland companies](https://blockchain.liberland.org/home/companies/allCompanies) and [trade their stocks](https://blockchain.liberland.org/home/wallet/stock-exchange)
- [Vote in Congress elections and referenda](https://blockchain.liberland.org/home/voting/congressional-assemble)
- [Sign legally binding on-chain contracts](https://blockchain.liberland.org/home/contracts/overview)
- [Stake your LLD for profit](https://blockchain.liberland.org/home/staking/overview)

If you haven't already, join the official [Telegram channel](https://t.me/liberlanders).`,
    tag: 'General',
  },
  {
    title: 'How to get LLD?',
    date: 'Jan 27, 2025',
    author: 'Liberland',
    text: `There are multiple ways to acquire LLD.
If you already have LLD on other chains like Ethereum or Solana, check out the [Bridging guide](https://docs.liberland.org/blockchain/ecosystem/cross-chain-bridge).
The easiest ways currently: [MEXC](https://www.mexc.com/exchange/LLD_USDT), [Coinstore](https://www.coinstore.com/spot/LLDUSDT), [Matcha/Uniswap](https://matcha.xyz/tokens/ethereum/0x054c9d4c6f4ea4e14391addd1812106c97d05690), or [Raydium on Solana](https://raydium.io/swap/?inputMint=sol&outputMint=GwKKPsJdY5oWMJ8RReWLcvb82KzW6FKy2bKoYW7kHr16).`,
    tag: 'Blockchain',
  },
  {
    title: 'LLD Staking guide',
    date: 'Feb 02, 2024',
    author: 'Liberland',
    text: `There are two types of staking LLD — Nominating and Validating. Nominating puts you in the service of electing honest, reliable validators. To maximize profits, choose the maximum possible number (16) of validators.
[Go to staking →](https://blockchain.liberland.org/home/staking/overview)`,
    tag: 'Staking',
  },
  {
    title: 'Liberland Merits — LLM',
    date: 'Apr 05, 2023',
    author: 'Liberland',
    text: `Liberland Merit (LLM) is the official politics and citizenship token of the Liberland blockchain. It represents political power and can be used to gain citizenship, interact with government services, or delegated (PolitiPooled) to representatives. [Learn more →](https://liberland.org/blockchain)`,
    tag: 'LLM',
  },
];

function StatCard({ label, value, unit, trend, trendColor, onClick }) {
  return (
    <button type="button" className={styles.statCard} onClick={onClick}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>
        {value}
        {unit && <span className={styles.statUnit}> {unit}</span>}
      </div>
      {trend && (
        <div className={`${styles.statTrend} ${trendColor === 'green' ? styles.trendGreen : trendColor === 'gold' ? styles.trendGold : styles.trendRed}`}>
          {trend}
        </div>
      )}
    </button>
  );
}

function IdentityBanner({ name, initials, isCitizen, onViewPassport }) {
  return (
    <section className={styles.banner}>
      <svg
        width="260"
        height="260"
        viewBox="0 0 40 40"
        fill="none"
        className={styles.bannerSeal}
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="19" fill="none" stroke="#E6BA56" strokeWidth="1" />
        <circle cx="20" cy="22.5" r="6.2" fill="none" stroke="#E6BA56" strokeWidth="1.2" />
        <path d="M20 16.3V11M20 16.3l3.4-3.1M20 16.3l-3.4-3.1M26 22.5h4.6M14 22.5H9.4M24.2 18.3l3-2.6M15.8 18.3l-3-2.6" stroke="#E6BA56" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M11 28.5q9 -5 18 0" stroke="#E6BA56" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>
      <div className={styles.bannerContent}>
        <div className={styles.bannerAvatar}>{initials || '?'}</div>
        <div className={styles.bannerInfo}>
          <div className={styles.bannerRole}>
            {isCitizen ? 'Citizen of Liberland' : 'Liberland dApp'}
          </div>
          <div className={styles.bannerName}>{name || 'Welcome'}</div>
          {isCitizen && (
            <div className={styles.bannerMeta}>
              <span className={styles.bannerVerified}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                eID Verified
              </span>
            </div>
          )}
        </div>
        {isCitizen && (
          <button type="button" className={styles.bannerAction} onClick={onViewPassport}>
            View passport
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}

function NewsCard({ item }) {
  return (
    <article className={styles.newsCard}>
      <div className={styles.newsTag}>{item.tag}</div>
      <h3 className={styles.newsTitle}>{item.title}</h3>
      <div className={styles.newsMeta}>{item.date} · {item.author}</div>
      <div className={styles.newsBody}>
        <Markdown>{item.text}</Markdown>
      </div>
    </article>
  );
}

function Feed() {
  const history = useHistory();
  const user = useSelector(userSelectors.selectUser);
  const givenName = useSelector(userSelectors.selectUserGivenName);
  const familyName = useSelector(userSelectors.selectUserFamilyName);

  const displayName = givenName
    ? `${givenName}${familyName ? ` ${familyName}` : ''}`
    : null;
  const initials = givenName && familyName
    ? `${givenName[0]}${familyName[0]}`.toUpperCase()
    : (givenName ? givenName.slice(0, 2).toUpperCase() : null);

  return (
    <div className={styles.page}>
      <IdentityBanner
        name={displayName}
        initials={initials}
        isCitizen={!!user}
        onViewPassport={() => history.push(router.home.documents)}
      />

      <div className={styles.statsGrid}>
        <StatCard
          label="Wallet"
          value="—"
          unit="LLD"
          trend="View balance →"
          trendColor="gold"
          onClick={() => history.push(router.wallet.overView)}
        />
        <StatCard
          label="Open referenda"
          value="—"
          trend="Cast your vote →"
          trendColor="red"
          onClick={() => history.push(router.voting.referendum)}
        />
        <StatCard
          label="Staking"
          value="—"
          unit="APY"
          trend="View validators →"
          trendColor="green"
          onClick={() => history.push(router.home.staking)}
        />
        <StatCard
          label="Congress"
          value="—"
          trend="Active motions →"
          trendColor="gold"
          onClick={() => history.push(router.home.congress)}
        />
      </div>

      <div className={styles.newsSection}>
        <div className={styles.newsSectionHeader}>
          <h2 className={styles.newsSectionTitle}>Republic updates</h2>
        </div>
        <div className={styles.newsGrid}>
          {NEWS.map((item) => (
            <NewsCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;
