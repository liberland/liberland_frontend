import React from 'react';
import cx from 'classnames';

import Card from '../Card';
import Status from '../Status';
import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';
import { ReactComponent as DotsIcon } from '../../assets/icons/three-dots.svg';
import styles from './styles.module.scss';
import stylesPage from '../../utils/pagesBase.module.scss';

function Feed() {
  const news = [{
    title: 'Staking guide',
    date: 'Apr 11, 2022',
    author: 'Liberland',
    text: `There are two types of staking in Liberland - Validator staking and PolitiPooling.
      Validator staking puts you in the role of a nominator - providing a technical service of electing honest,
      reliable validators and receiving a portion of the newly minted LLD. To maximize rewards,
      choose the maximum possible number (16) of validators to stake in. Be careful though,
      as electing dishonest or unreliable validators will get you slashed. For more detail,
      https://wiki.polkadot.network/docs/learn-staking`,
    hashtags: ['#Staking', '#LLD'],
    type: 'liberland',
  },
  {
    title: 'Liberland Merits - LLM',
    date: 'Apr 05, 2022',
    author: 'Liberland',
    text: `Liberland Merit (LLM) is the official politics and citizenship token of the Liberland blockchain.
      It represents political power in Liberland, and can be used to gain citizenship,
      interact with government services or delegated (PolitiPooled) to representatives,
      who then use it to vote on Law proposals.
      Maximum possible supply of LLM is 70 million. It is expected to close in on that cap by 2070.`,
    hashtags: ['#LLM', '#Theory'],
    type: 'president',
  },
  {
    title: 'Wallet transactions',
    date: 'Apr 01, 2022',
    author: 'Liberland',
    text: `You can use your hard earned LLD to interact and trade with other people using the wallet functionality.
     The minimum unit of LLM, a grain, is 10^-12 LLM - so make sure to select the proper unit.`,
    hashtags: ['#LLM', '#Economy'],
    type: 'liberland',
  },
  {
    title: 'Creating a wallet',
    date: 'March 27, 2022',
    author: 'Liberland',
    text: `In order to interact with the Liberland blockchain, you will need to setup a wallet.
      Keep your wallet info secured, as it represents you on the blockchain. 
      We recommend using a polkadotJs browser extension. 
      Learn more at https://liberland-1.gitbook.io/wiki/v/public-documents/blockchain/how-to-create-wallet `,
    hashtags: ['#Wallet', '#Blockchain'],
    type: 'liberland',
  }];

  return (
    <div className={stylesPage.contentWrapper}>
      <div className={styles.cardWrapper}>
        {
          news.map((newsItem) => (
            <Card
              key={newsItem.title + newsItem.date}
              className={cx(stylesPage.overviewWrapper, styles.card)}
            >
              <div className={styles.mainContent}>
                <h2 className={stylesPage.cardTitle}>{newsItem.title}</h2>
                <p className={styles.cardInfo}>
                  {newsItem.date}
                  {' '}
                  •
                  {' '}
                  <span
                    className={
                      cx(
                        styles.author,
                        {
                          [styles.green]: newsItem.type === 'president',
                          [styles.yellow]: newsItem.type === 'liberland',
                        },
                      )
                    }
                  >
                    {newsItem.author}
                  </span>
                </p>
                <p className={cx(styles.cardInfo, styles.withMargin)}>{newsItem.text}</p>
              </div>

              <div className={styles.cardFooter}>
                <div>
                  {newsItem.hashtags.map((hashtag, index) => (
                    <Status
                      key={hashtag}
                      className={cx({
                        [styles.greenStatus]: !index && newsItem.type === 'president',
                        [styles.yellowStatus]: !index && newsItem.type === 'liberland',
                      })}
                      completed={newsItem.type === 'president'}
                      status={hashtag}
                      pending={newsItem.type === 'liberland'}
                    />
                  ))}
                </div>
                <div>
                  <StarIcon />
                  <DotsIcon />
                </div>
              </div>
            </Card>
          ))
        }
      </div>
    </div>
  );
}

export default Feed;
