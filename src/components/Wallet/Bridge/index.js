import React from 'react';
import { useEthers } from '@usedapp/core';
import { Redirect, Route, Switch } from 'react-router-dom';
import Card from '../../Card';
import Connect from './Connect';
import EthereumToSubstrate from './EthereumToSubstrate';
import SubstrateToEthereum from './SubstrateToEthereum';
import Tabs from '../../Tabs';
import router from '../../../router';
import styles from './styles.module.scss';

const navigationList = [
  {
    route: `${router.wallet.ethBridgeDeposit}`,
    title: 'Send to Ethereum',
  },
  {
    route: `${router.wallet.ethBridgeWithdraw}`,
    title: 'Send to Liberland',
  },
];

function Bridge() {
  const { account } = useEthers();
  if (!account) return <Card className={styles.bridgeWrapper}><Connect /></Card>;

  return (
    <>
      <Tabs navigationList={navigationList} />
      <Card className={styles.bridgeWrapper}>
        <Connect />
      </Card>
      <Card className={styles.bridgeWrapper} title="Bridge">
        <div>
          <Switch>
            <Route
              exact
              path={router.wallet.ethBridgeWithdraw}
              component={EthereumToSubstrate}
            />
            <Route
              exact
              path={router.wallet.ethBridgeDeposit}
              component={SubstrateToEthereum}
            />
            <Route
              exact
              path={router.wallet.ethBridge}
              render={() => (
                <Redirect to={router.wallet.ethBridgeDeposit} />
              )}
            />
          </Switch>
        </div>
      </Card>
    </>
  );
}

export default Bridge;
