import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Result from 'antd/es/result';
import Collapse from 'antd/es/collapse';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Flex from 'antd/es/flex';
import Spin from 'antd/es/spin';
import { useMediaQuery } from 'usehooks-ts';
import { blockchainSelectors, dexSelectors } from '../../../../redux/selectors';
import { dexActions } from '../../../../redux/actions';
import { useStockContext } from '../../StockContext';
import ExchangeItem from '../ExchangeItem';
import AddAssetForm from '../AddAssetForm';
import { sortByMap } from '../ExchangeSort/utils';
import ExchangeSort from '../ExchangeSort';
import styles from './styles.module.scss';
import { valueToBN } from '../../../../utils/walletHelpers';

function ExchangeList() {
  const dispatch = useDispatch();
  const dexs = useSelector(dexSelectors.selectorDex);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const [highLiquiditySort, setHighLiquiditySort] = useState(Object.keys(sortByMap)[0]);
  const [lowLiquiditySort, setLowLiquiditySort] = useState(Object.keys(sortByMap)[0]);
  const isBiggerThanDesktop = useMediaQuery('(min-width: 992px)');
  const { isStock } = useStockContext();

  useEffect(() => {
    dispatch(dexActions.getPools.call());
  }, [dispatch, walletAddress]);

  const { poolsData, assetsPoolData } = dexs || {};

  const [highLiquidity, lowLiquidity] = useMemo(() => poolsData
    ?.filter(({ isStock: isStockPool }) => isStockPool === isStock)
    .reduce(([highLiq, lowLiq], pool) => {
      const asset1Liquidity = valueToBN(pool.reserved?.asset1 || 0);
      const asset2Liquidity = valueToBN(pool.reserved?.asset2 || 0);
      if (asset1Liquidity > 1 && asset2Liquidity > 1) {
        highLiq.push(pool);
      } else {
        lowLiq.push(pool);
      }
      return [highLiq, lowLiq];
    }, [[], []]) || [[], []], [poolsData, isStock]);

  const sortPool = (pool, type) => pool.sort(
    (aPool, bPool) => sortByMap[type](aPool, assetsPoolData, bPool, assetsPoolData),
  );

  if (!dexs) {
    return (
      <Spin />
    );
  }

  return (
    <Flex vertical gap="20px">
      {!highLiquidity.length && !lowLiquidity.length && (
        <Result status="error" title="No pools were found" />
      )}
      {highLiquidity.length > 0 && (
        <Collapse
          defaultActiveKey={['highliq']}
          collapsible="icon"
          className={styles.exchangePairs}
          items={[
            {
              key: 'highliq',
              label: 'Exchange pairs',
              extra: isBiggerThanDesktop && (
                <ExchangeSort onSort={setHighLiquiditySort} sortBy={highLiquiditySort} />
              ),
              children: (
                <Row gutter={[16, 16]}>
                  {!isBiggerThanDesktop && (
                    <Col span={24}>
                      <Flex justify="start">
                        <ExchangeSort onSort={setHighLiquiditySort} sortBy={highLiquiditySort} />
                      </Flex>
                    </Col>
                  )}
                  {sortPool(highLiquidity, highLiquiditySort).map((pool) => (
                    <Col span={24} key={pool.asset1 + pool.asset2}>
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
          collapsible="icon"
          items={[
            {
              key: 'lowliq',
              label: 'Low liquidity exchange pairs',
              extra: isBiggerThanDesktop && (
                <ExchangeSort onSort={setLowLiquiditySort} sortBy={lowLiquiditySort} />
              ),
              children: (
                <Row gutter={[16, 16]}>
                  {!isBiggerThanDesktop && (
                    <Col span={24}>
                      <Flex justify="start">
                        <ExchangeSort onSort={setLowLiquiditySort} sortBy={lowLiquiditySort} />
                      </Flex>
                    </Col>
                  )}
                  {sortPool(lowLiquidity, lowLiquiditySort).map((pool) => (
                    <Col span={24} key={pool.asset1 + pool.asset2}>
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
      <Flex wrap gap="15px">
        <AddAssetForm poolsData={poolsData} />
      </Flex>
    </Flex>
  );
}

export default ExchangeList;
