import PropTypes from 'prop-types';

export const ReservedAssetPropTypes = PropTypes.shape({
  asset1: PropTypes.string,
  asset2: PropTypes.string,
});

export const AssetDataPropTypes = PropTypes.shape({
  decimals: PropTypes.number,
  deposit: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  name: PropTypes.string,
  symbol: PropTypes.string,
});

export const ExchangeItemPropTypes = {
  asset1: PropTypes.string.isRequired,
  asset2: PropTypes.string.isRequired,
  lpTokensBalance: PropTypes.string.isRequired,
  lpTokens: PropTypes.string.isRequired,
  liquidity: PropTypes.string.isRequired,
  assetData1: AssetDataPropTypes.isRequired,
  assetData2: AssetDataPropTypes.isRequired,
  reserved: ReservedAssetPropTypes.isRequired,
  swapPriceExactTokensForTokens: PropTypes.string.isRequired,
  swapPriceTokensForExactTokens: PropTypes.string.isRequired,
};

export const AssetsPropTypes = PropTypes.shape({
  asset1: PropTypes.string.isRequired,
  asset2: PropTypes.string.isRequired,
  assetData1: AssetDataPropTypes.isRequired,
  assetData2: AssetDataPropTypes.isRequired,
  asset1ToShow: PropTypes.string.isRequired,
  asset2ToShow: PropTypes.string.isRequired,
});
