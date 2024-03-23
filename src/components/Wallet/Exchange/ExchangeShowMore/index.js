import React from 'react';
import PropTypes from 'prop-types';
import { formatPropertlyValue } from '../../../../utils/dexFormater';
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
  swapPriceTokensForExactTokens,
  swapPriceExactTokensForTokens,
}) {
  return (
    <div className={styles.moreDetails}>
      <div className={styles.reserved}>
        {!reserved?.asset2 && (
        <div>
          Pool don&apos;t have any liquidity
        </div>
        )}
        {reserved && reserved?.asset2 && (
        <div>
          {`In the pool
              ${formatPropertlyValue(asset1, reserved.asset1, asset1ToShow)}  
            / ${formatPropertlyValue(asset2, reserved.asset2, asset2ToShow)}` }
        </div>
        )}
      </div>
      <div className={styles.exchange}>
        <span>
          {`1 ${asset1ToShow} = ${swapPriceTokensForExactTokens} ${asset2ToShow}`}
        </span>
        <span>
          {`1 ${asset2ToShow} = ${swapPriceExactTokensForTokens} ${asset1ToShow}`}
        </span>
      </div>
      <div className={styles.liquidity}>
        {liquidity
          ? `Your liquidity: ${((liquidity / lpTokensBalance) * 100)}% (${liquidity} Lp Tokens)`
          : 'Not found your liquidity in this pool'}
        <Button small green onClick={handleModalLiquidity}>
          Add liquidity
        </Button>
      </div>
    </div>
  );
}

ExchangeShowMore.propTypes = {
  reserved: ReservedAssetPropTypes.isRequired,
  handleModalLiquidity: PropTypes.func.isRequired,
  asset1: PropTypes.string.isRequired,
  asset2: PropTypes.string.isRequired,
  lpTokensBalance: PropTypes.string.isRequired,
  liquidity: PropTypes.string.isRequired,
  asset1ToShow: PropTypes.string.isRequired,
  asset2ToShow: PropTypes.string.isRequired,
  swapPriceTokensForExactTokens: PropTypes.string.isRequired,
  swapPriceExactTokensForTokens: PropTypes.string.isRequired,

};

export default ExchangeShowMore;
