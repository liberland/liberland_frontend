import React from 'react';
import PropTypes from 'prop-types';
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
              ${formatProperlyValue(asset1, reserved.asset1, asset1ToShow, asset1Decimals || 0)}  
            / ${formatProperlyValue(asset2, reserved.asset2, asset2ToShow, asset2Decimals || 0)}` }
        </div>
        )}
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
  lpTokensBalance: PropTypes.string,
  liquidity: PropTypes.string,
  asset1ToShow: PropTypes.string.isRequired,
  asset2ToShow: PropTypes.string.isRequired,
  asset1Decimals: PropTypes.number,
  asset2Decimals: PropTypes.number,

};

export default ExchangeShowMore;
