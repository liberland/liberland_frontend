import React from 'react';
import PropTypes from 'prop-types';
import { BN, BN_HUNDRED } from '@polkadot/util';
import { calculatePooled, getDecimalsForAsset } from '../../../../utils/dexFormatter';
import Button from '../../../Button/Button';
import styles from '../styles.module.scss';
import { ReservedAssetPropTypes } from '../proptypes';
import { formatAssets } from '../../../../utils/walletHelpers';

function ExchangeShowMore({
  handleModalLiquidity,
  handleModalLiquidityRemove,
  asset1,
  asset2,
  liquidity,
  asset1ToShow,
  asset2ToShow,
  reserved,
  lpTokensBalance,
  asset1Decimals,
  asset2Decimals,
  isReservedDataEmpty,
}) {
  const decimals1 = getDecimalsForAsset(asset1, asset1Decimals);
  const decimals2 = getDecimalsForAsset(asset2, asset2Decimals);
  return (
    <div className={styles.moreDetails}>
      <div className={styles.reserved}>
        {isReservedDataEmpty && (
        <div>
          Pool doesn&apos;t have any liquidity
        </div>
        )}
        {reserved && (
        <div>
          {`In the pool
              ${formatAssets(reserved.asset1, decimals1, { symbol: asset1ToShow, withAll: true })}  
            / ${formatAssets(reserved.asset2, decimals2, { symbol: asset2ToShow, withAll: true })}` }
        </div>
        )}
      </div>
      <div className={styles.liquidity}>
        <div className={styles.text}>
          {lpTokensBalance !== 0 || !liquidity
            ? (
              <>
                <span>
                  Your liquidity:
                  {' '}
                  {new BN(lpTokensBalance).mul(BN_HUNDRED).div(new BN(liquidity)).toString()}
                  % (
                  {lpTokensBalance}
                  {' '}
                  Lp Tokens)
                </span>
                <span>
                  {`Pooled ${asset1ToShow}: `}
                  {formatAssets(
                    calculatePooled(lpTokensBalance, liquidity, reserved.asset1),
                    decimals1,
                    { symbol: asset1ToShow, withAll: true },
                  )}
                </span>
                <span>
                  {`Pooled ${asset2ToShow}: `}
                  {formatAssets(
                    calculatePooled(lpTokensBalance, liquidity, reserved.asset2),
                    decimals2,
                    { symbol: asset2ToShow, withAll: true },
                  )}
                </span>
              </>
            )

            : (
              <span>
                Not found your liquidity in this pool
              </span>
            )}

        </div>
        <div className={styles.liquidityButtons}>
          {!isReservedDataEmpty
            && (
            <Button small green onClick={handleModalLiquidityRemove}>
              Remove Liquidity
            </Button>
            )}

          <Button small green onClick={handleModalLiquidity}>
            Add liquidity
          </Button>
        </div>
      </div>
    </div>
  );
}

ExchangeShowMore.defaultProps = {
  asset1Decimals: null,
  asset2Decimals: null,
  reserved: null,
  lpTokensBalance: null,
  liquidity: null,
};

ExchangeShowMore.propTypes = {
  reserved: ReservedAssetPropTypes,
  handleModalLiquidity: PropTypes.func.isRequired,
  handleModalLiquidityRemove: PropTypes.func.isRequired,
  asset1: PropTypes.string.isRequired,
  asset2: PropTypes.string.isRequired,
  lpTokensBalance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // eslint-disable-next-line react/forbid-prop-types
  liquidity: PropTypes.object,
  asset1ToShow: PropTypes.string.isRequired,
  asset2ToShow: PropTypes.string.isRequired,
  asset1Decimals: PropTypes.number,
  asset2Decimals: PropTypes.number,
  isReservedDataEmpty: PropTypes.bool.isRequired,
};

export default ExchangeShowMore;
