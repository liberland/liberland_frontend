import React from 'react';
import cx from 'classnames';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Card from '../../Card';
import styles from './styles.module.scss';
import ExchangeList from './ExchangeList';

function Exchange() {
  return (
    <div className={stylesPage.contentWrapper}>
      <div className={stylesPage.sectionWrapper}>
        <Card className={cx(stylesPage.overviewWrapper, styles.cardWrapper)} title="Info">
          <p>
            Liberland DEX uses alghoritmic market making which may not always be up to date with other exchanges.
            Arbitrage is possible.
            <br />
            <a href="https://docs.liberland.org/public-documents/blockchain/ecosystem/liberland-decentralized-exchange">Learn more</a>
          </p>
        </Card>
        <br />
        <Card className={cx(stylesPage.overviewWrapper, styles.cardWrapper)} title="Overview">
          <ExchangeList />
        </Card>
      </div>
    </div>
  );
}

export default Exchange;
