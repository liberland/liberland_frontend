import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from 'antd/es/alert';
import Collapse from 'antd/es/collapse';
import List from 'antd/es/list';
import { blockchainSelectors, dexSelectors } from '../../../../redux/selectors';
import { dexActions } from '../../../../redux/actions';
import ExchangeItem from '../ExchangeItem';
import AddAssetForm from '../AddAssetForm';
import { sortByMap } from '../ExchangeSort/utils';
import ExchangeSort from '../ExchangeSort';

function ExchangeList() {
  const dispatch = useDispatch();
  const dexs = useSelector(dexSelectors.selectorDex);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const [highLiquiditySort, setHighLiquiditySort] = React.useState(Object.keys(sortByMap)[0]);
  const [lowLiquiditySort, setLowLiquiditySort] = React.useState(Object.keys(sortByMap)[0]);

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
      <Alert type="error" message="No pools were found" />
    );
  }

  return (
    <>
      {highLiquidity.length > 0 && (
        <Collapse
          defaultActiveKey={['highliq']}
          items={[
            {
              key: 'highliq',
              label: 'Exchange pairs',
              extra: <ExchangeSort onSort={setHighLiquiditySort} sortBy={highLiquiditySort} />,
              children: (
                <List
                  dataSource={highLiquidity.sort(
                    (aPool, bPool) => sortByMap[highLiquiditySort](aPool, assetsPoolData, bPool, assetsPoolData),
                  )}
                  renderItem={(pool) => (
                    <ExchangeItem
                      poolData={pool}
                      assetsPoolData={assetsPoolData}
                    />
                  )}
                />
              ),
            },
          ]}
        />
      )}
      {lowLiquidity.length > 0 && (
        <Collapse
          items={[
            {
              key: 'lowliq',
              label: 'Low liquidity exchange pairs',
              extra: <ExchangeSort onSort={setLowLiquiditySort} sortBy={lowLiquiditySort} />,
              children: (
                <List
                  dataSource={lowLiquidity.sort(
                    (aPool, bPool) => sortByMap[lowLiquiditySort](aPool, assetsPoolData, bPool, assetsPoolData),
                  )}
                  renderItem={(pool) => (
                    <ExchangeItem
                      poolData={pool}
                      assetsPoolData={assetsPoolData}
                    />
                  )}
                />
              ),
            },
          ]}
        />
      )}
      <AddAssetForm poolsData={poolsData} />
    </>
  );
}

export default ExchangeList;
