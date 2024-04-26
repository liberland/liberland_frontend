import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { blockchainSelectors, dexSelectors } from '../../../../redux/selectors';
import { dexActions } from '../../../../redux/actions';
import stylesPage from '../../../../utils/pagesBase.module.scss';
import styles from '../styles.module.scss';
import ExchangeItem from '../ExchangeItem';

function ExchangeList() {
  const dispatch = useDispatch();
  const dexs = useSelector(dexSelectors.selectorDex);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  useEffect(() => {
    dispatch(dexActions.getPools.call());
  }, [dispatch, walletAddress]);

  if (!dexs) {
    return (
      <div>Loading..</div>
    );
  }
  const { poolsData, assetsPoolData } = dexs;

  if (poolsData?.length < 1) {
    return (
      <div>There is no any pool...</div>
    );
  }
  return (
    <div className={cx(stylesPage.overViewCard, styles.list)}>
      {
        poolsData?.map((pool, index) => (
          <ExchangeItem
            poolData={pool}
            assetsPoolData={assetsPoolData}
            // eslint-disable-next-line react/no-array-index-key
            key={index + pool.asset1 + pool.asset2}
          />
        ))
}
    </div>
  );
}

export default ExchangeList;
