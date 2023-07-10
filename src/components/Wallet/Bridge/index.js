import React, { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { Redirect, Route, Switch } from 'react-router-dom';
import Card from '../../Card';
import Connect from './Connect';
import EthereumToSubstrate from './EthereumToSubstrate';
import SubstrateToEthereum from './SubstrateToEthereum';
import Tabs from '../../Tabs';
import router from '../../../router';
import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { bridgeSelectors } from '../../../redux/selectors';
import { bridgeActions } from '../../../redux/actions';

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
  const { account, switchNetwork, chainId } = useEthers()

  const goodChainId = parseInt(process.env.REACT_APP_ETHER_CHAIN_ID);
  useEffect(() => {
    (async () => {
      if (chainId !== goodChainId)
        await switchNetwork(goodChainId)
    })();
  }, [chainId, switchNetwork, goodChainId]);

  const dispatch = useDispatch();

  const toEthereumInitialized = useSelector(bridgeSelectors.toEthereumInitialized);
  useEffect(() => {
    if (account && !toEthereumInitialized)
      dispatch(bridgeActions.getTransfersToEthereum.call());
  }, [dispatch, account, toEthereumInitialized]);

  const toSubstrateInitialized = useSelector(bridgeSelectors.toSubstrateInitialized);
  useEffect(() => {
    if (account && !toSubstrateInitialized)
      dispatch(bridgeActions.getTransfersToSubstrate.call());
  }, [dispatch, account, toSubstrateInitialized]);

  if (!account) return <Card className={styles.bridgeWrapper}><Connect /></Card>;
  if (chainId !== goodChainId) return <Card className={styles.bridgeWrapper}>Change network in MetaMask</Card>;

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
