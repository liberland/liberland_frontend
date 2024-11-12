import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { blockchainSelectors, dexSelectors } from '../../../../redux/selectors';
import { dexActions } from '../../../../redux/actions';
import Button from '../../../Button/Button';
import stylesPage from '../../../../utils/pagesBase.module.scss';
import styles from '../styles.module.scss';
import ExchangeItem from '../ExchangeItem';
import AddAssetForm from '../AddAssetForm';

function ExchangeList() {
  const dispatch = useDispatch();
  const [showLowLiq, setShowLoqLiq] = React.useState(false);
  const dexs = useSelector(dexSelectors.selectorDex);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  React.useEffect(() => {
    dispatch(dexActions.getPools.call());
  }, [dispatch, walletAddress]);

  const { poolsData, assetsPoolData } = dexs || {};

  const [highLiquidity, lowLiquidity] = React.useMemo(() => poolsData?.reduce(([highLiq, lowLiq], pool) => {
    const asset1Liquidity = pool.reserved?.asset1.toNumber() || 0;
    const asset2Liquidity = pool.reserved?.asset2.toNumber() || 0;
    if (asset1Liquidity > 1 && asset2Liquidity > 1) {
      highLiq.push(pool);
    } else {
      lowLiq.push(pool);
    }
    return [highLiq, lowLiq];
  }, [[], []]) || [[], []], [poolsData]);

  if (!dexs) {
    return (
      <div>Loading...</div>
    );
  }

  if (!highLiquidity.length && !lowLiquidity.length) {
    return (
      <div>There is no any pool...</div>
    );
  }

  return (
    <div className={cx(stylesPage.overViewCard, styles.list)}>
      {highLiquidity?.map((pool, index) => (
        <ExchangeItem
          poolData={pool}
          assetsPoolData={assetsPoolData}
          // eslint-disable-next-line react/no-array-index-key
          key={index + pool.asset1 + pool.asset2}
        />
      ))}
      {showLowLiq && (
        <>
          <h4 className={styles.lowLiqTitle}>
            Low liquidity pools
          </h4>
          {lowLiquidity?.map((pool, index) => (
            <ExchangeItem
              poolData={pool}
              assetsPoolData={assetsPoolData}
              // eslint-disable-next-line react/no-array-index-key
              key={index + pool.asset1 + pool.asset2}
            />
          ))}
        </>
      )}
      <div className={styles.showLowLiq}>
        <Button
          small
          green
          onClick={() => setShowLoqLiq(!showLowLiq)}
        >
          {!showLowLiq ? 'Show low liquidity pools' : 'Hide low liquidity pools'}
        </Button>
      </div>
      <AddAssetForm poolsData={poolsData} />
    </div>
  );
}

export default ExchangeList;
