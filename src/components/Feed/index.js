/* eslint-disable max-len */
import React from 'react';
import cx from 'classnames';
import Flex from 'antd/es/flex';
import Card from 'antd/es/card';
import List from 'antd/es/list';
import Paragraph from 'antd/es/typography/Paragraph';
import Markdown from 'markdown-to-jsx';
import Status from '../Status';
import styles from './styles.module.scss';

function Feed() {
  const news = [
    {
      title: 'Claiming your tokens and residency',
      date: 'Feb 12, 2024',
      author: 'Liberland',
      text: `In order to claim your citizenship, e-residency, and any LLM and LLDs you might have gotten for the presale,
      You need to connect your liberland account and your blockchain address, claim onboarding LLDs so that you can start using the chain
      and pay gas feed right away, and <a href="https://blockchain.liberland.org/home/profile">update your identity here</a>. 
      Note that while no fields are mandatory except the age check, setting the display name is a good idea as it is your on-chain username.
      After setting your identity, the Ministry of Interior will verify it, and send you your tokens. This usually takes about a day.
      Once this is done, congratulations and welcome to Liberland blockchain!
      For detailed steps, follow the <a href="https://docs.liberland.org/blockchain/for-citizens/onboarding">Onboarding guide</a>
      `,
      hashtags: ['#Onboarding'],
      type: 'liberland',
    },
    {
      title: 'LLD Staking guide',
      date: 'Feb 02, 2024',
      author: 'Liberland',
      text: `There are two types of staking LLD in Liberland - Nominating and Validating.
      Nominating puts you in the service of electing honest, reliable validators - the servers running the chain
      and receiving a portion of the newly minted LLD and block rewards. To maximize profits,
      choose the maximum possible number (16) of validators to stake in. 
      To start staking LLD immediately, <a href="https://blockchain.liberland.org/home/staking/overview">Go to staking</a>.
      If you are interested,
      <a href="https://docs.liberland.org/blockchain/for-validators-nominators-and-stakers/staking">Learn more here</a>`,
      hashtags: ['#Staking', '#LLD'],
      type: 'liberland',
    },
    {
      title: 'What can you do on Liberland blockchain?',
      date: 'Jan 27, 2024',
      author: 'Liberland',
      text: `Trading LLD and LLM are available, or soon will be available at coinstore, emirex, uniswap and polkaswap.
     LLD and LLM can be bridged to ethereum via the Liberland ETH bridge or polkaswap via the SORA bridge.
     LLD can be staked for inflation and block rewards.
     Any citizen can engage in the political process by voting for congressmen and referendums in the Voting tab.
     Politics for now is just advisory, but the expected date of binding politics is the birthday of Liberland on 13.4.
     Upcoming features include company registrations, Liberland stock market, the judiciary system and contracts enforcement.`,
      hashtags: ['#Blockchain'],
      type: 'liberland',
    },
    {
      title: 'Liberland Merits - LLM',
      date: 'Apr 05, 2023',
      author: 'Liberland',
      text: `Liberland Merit (LLM) is the official politics and citizenship token of the Liberland blockchain.
    It represents political power in Liberland, and can be used to gain citizenship,
    interact with government services or delegated (PolitiPooled) to representatives,
    who then use it to vote on Law proposals.
    Maximum possible supply of LLM is 70 million. It is expected to close in on that cap by 2070.
    Read more about LLMs and the Liberland blockchain <a href="https://liberland.org/blockchain">here</a>
    `,
      hashtags: ['#LLM', '#Theory'],
      type: 'president',
    },
  ];

  return (
    <List
      grid={{ gutter: 16 }}
      dataSource={news}
      renderItem={(newsItem) => (
        <Card
          key={newsItem.title + newsItem.date}
          title={newsItem.title}
          extra={newsItem.date}
          cover={(
            <Flex wrap gap="4px" className={styles.cover}>
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
            </Flex>
          )}
        >
          <Paragraph>
            <Markdown>
              {newsItem.text}
            </Markdown>
          </Paragraph>
        </Card>
      )}
    />
  );
}

export default Feed;
