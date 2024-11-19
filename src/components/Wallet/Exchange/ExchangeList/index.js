import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from 'antd/es/alert';
import Collapse from 'antd/es/collapse';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import { blockchainSelectors, dexSelectors } from '../../../../redux/selectors';
import { dexActions } from '../../../../redux/actions';
import ExchangeItem from '../ExchangeItem';
import AddAssetForm from '../AddAssetForm';
import { sortByMap } from '../ExchangeSort/utils';
import ExchangeSort from '../ExchangeSort';
import styles from '../styles.module.scss';

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

  const sortPool = (pool, type) => pool.sort(
    (aPool, bPool) => sortByMap[type](aPool, assetsPoolData, bPool, assetsPoolData),
  );

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
          className={styles.exchangePairs}
          items={[
            {
              key: 'highliq',
              label: 'Exchange pairs',
              extra: <ExchangeSort onSort={setHighLiquiditySort} sortBy={highLiquiditySort} />,
              children: (
                <Row>
                  {sortPool(highLiquidity, highLiquiditySort).map((pool) => (
                    <Col span={24}>
                      <ExchangeItem
                        poolData={pool}
                        assetsPoolData={assetsPoolData}
                      />
                    </Col>
                  ))}
                </Row>
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
                <Row>
                  {sortPool(lowLiquidity, lowLiquiditySort).map((pool) => (
                    <Col span={24}>
                      <ExchangeItem
                        poolData={pool}
                        assetsPoolData={assetsPoolData}
                      />
                    </Col>
                  ))}
                </Row>
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
