import React from 'react';
import cx from 'classnames';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Card from '../../Card';
import styles from './styles.module.scss';
import Button from '../../Button/Button';

function Bridge() {
  const goToHashiBridge = () => {
    const stakingLink = 'https://polkaswap.io/#/bridge/';
    window.open(stakingLink);
  };
  return (
    <div className={stylesPage.contentWrapper}>
      <div className={stylesPage.sectionWrapper}>
        <Card className={cx(stylesPage.overviewWrapper, styles.cardWrapper)} title="Info">
          <p>
            Liberland chain is connected to other chains via SORA HASHI bridge.
            <br />
            <a
              href="https://docs.liberland.org/public-documents/blockchain/ecosystem/cross-chain-bridge"
            >
              Learn more
            </a>
          </p>
        </Card>
        <br />
        <Card className={cx(stylesPage.overviewWrapper, styles.cardWrapper)} title="Bridge">
          <Button small primary onClick={() => goToHashiBridge()}>
            GO TO BRIDGE
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default Bridge;
