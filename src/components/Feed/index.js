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
      title: 'Welcome to Liberland blockchain',
      date: 'Feb 12, 2025',
      author: 'Liberland',
      text: `Liberland is the young new country located on a 7km^2 island on the Danube river.
      The country is founded on the principles of Libertarianism and blockchain governance. 
      Welcome to the official dApp of Liberland. Here, you can:
      <ul>
        <li><a href="https://blockchain.liberland.org/home/wallet/overview">Handle finances and get deFi services</a></li>
        <li><a href="https://blockchain.liberland.org/home/companies/allCompanies">Browse Liberland companies</a> and <a href="https://blockchain.liberland.org/home/wallet/stock-exchange">trade their stocks</a></li>
        <li><a href="https://blockchain.liberland.org/home/companies/create">Open a company in Liberland</a></li>
        <li><a href="https://blockchain.liberland.org/home/voting/congressional-assemble">Vote in Congress elections and referenda</a></li>
        <li><a href="https://blockchain.liberland.org/home/contracts/overview">Sign legally binding on-chain contracts</a></li>
        <li><a href="https://blockchain.liberland.org/home/legislation/Decision">Browse Liberland legislation</a>, kept on blockchain with legal force</li>
        <li><a href="https://blockchain.liberland.org/home/offices/ministry-of-finance">Transparently view government decisions and spending</a></li>
        <li><a href="https://blockchain.liberland.org/home/staking/overview">Stake your LLD for profit</a></li>
      </ul>
      `,
      hashtags: ['#General'],
      type: 'liberland',
    },
    {
      title: 'How to get LLD?',
      date: 'Jan 27, 2025',
      author: 'Liberland',
      text: `There are multiple ways to acquire LLD. 
      If you already have LLD on other chains like Ethereum or Solana, check out the <a href="https://docs.liberland.org/blockchain/ecosystem/cross-chain-bridge">Bridging guide</a>.
      The easiest way to get LLDs currently are to use one of the centralized exchanges where selling USDT for LLD is possible.
      <ul>
        <li><a href="https://www.mexc.com/exchange/LLD_USDT">MEXC</a> on Liberland blockchain</li>
        <li><a href="https://www.coinstore.com/spot/LLDUSDT">Coinstore</a> on Liberland blockchain</li>
        <li><a href="https://matcha.xyz/tokens/ethereum/0x054c9d4c6f4ea4e14391addd1812106c97d05690?sellChain=1&sellAddress=0xdac17f958d2ee523a2206206994597c13d831ec7">Matcha/Uniswap</a> on Ethereum</li>
        <li><a href="https://emirex.com">Emirex</a> on Liberland blockchain</li>
        <li><a href="https://raydium.io/swap/?inputMint=sol&outputMint=GwKKPsJdY5oWMJ8RReWLcvb82KzW6FKy2bKoYW7kHr16">Raydium</a> on Solana</li>
      </ul>
      LLD purchased on other chains like Ethereum, Solana or TRON can be <a href="https://docs.liberland.org/blockchain/ecosystem/cross-chain-bridge">bridged to Liberland Blockchain</a>.`,
      hashtags: ['#Blockchain', 'LLD'],
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
