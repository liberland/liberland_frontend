import React from 'react';
import PropTypes from 'prop-types';
import { BN } from '@polkadot/util';
import { formatProperlyValue } from '../../../../utils/dexFormater';
import Button from '../../../Button/Button';
import styles from '../styles.module.scss';
import { ReservedAssetPropTypes } from '../proptypes';

function ExchangeShowMore({
  handleModalLiquidity,
  asset1,
  asset2,
  liquidity,
  asset1ToShow,
  asset2ToShow,
  reserved,
  lpTokensBalance,
  asset1Decimals,
  asset2Decimals,
}) {
  const calculatePooled = (
    assetToShow,
    lpTokensData,
    liquidityData,
    reservedAsset,
  ) => (new BN(reservedAsset).mul(new BN(lpTokensData))).div(new BN(liquidityData));

  return (
    <div className={styles.moreDetails}>
      <div className={styles.reserved}>
        {(reserved?.asset2?.isEmpty || reserved?.asset1?.isEmpty) && (
        <div>
          Pool doesn&apos;t have any liquidity
        </div>
        )}
        {reserved && (
        <div>
          {`In the pool
              ${formatProperlyValue(asset1, reserved.asset1, asset1Decimals || 0, asset1ToShow)}  
            / ${formatProperlyValue(asset2, reserved.asset2, asset2Decimals || 0, asset2ToShow)}` }
        </div>
        )}
      </div>
      <div className={styles.liquidity}>
        <div className={styles.text}>
          {liquidity
            ? (
              <>
                <span>
                  Your liquidity:
                  {' '}
                  {((lpTokensBalance / liquidity) * 100)}
                  % (
                  {lpTokensBalance}
                  {' '}
                  Lp Tokens)
                </span>
                <span>
                  {`Pooled ${asset1ToShow}: `}
                  {formatProperlyValue(
                    asset1,
                    calculatePooled(asset1ToShow, lpTokensBalance, liquidity, reserved.asset1),
                    asset1Decimals || 0,
                    asset1ToShow,
                  )}
                </span>
                <span>
                  {`Pooled ${asset2ToShow}: `}
                  {formatProperlyValue(
                    asset2,
                    calculatePooled(asset2ToShow, lpTokensBalance, liquidity, reserved.asset2),
                    asset2Decimals || 0,
                    asset2ToShow,
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

        <Button small green onClick={handleModalLiquidity}>
          Add liquidity
        </Button>
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
  asset1: PropTypes.string.isRequired,
  asset2: PropTypes.string.isRequired,
  lpTokensBalance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  liquidity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  asset1ToShow: PropTypes.string.isRequired,
  asset2ToShow: PropTypes.string.isRequired,
  asset1Decimals: PropTypes.number,
  asset2Decimals: PropTypes.number,

};

export default ExchangeShowMore;
