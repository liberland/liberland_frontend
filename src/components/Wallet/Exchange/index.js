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
        <Card className={cx(stylesPage.overviewWrapper, styles.cardWrapper)} title="Overview">
          <ExchangeList />
        </Card>
      </div>
    </div>
  );
}

export default Exchange;
