import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Button from '../../Button/Button';
import router from '../../../router';
import TradeTokensModal from '../../Modals/TradeTokens';

export default function TradeButton({
  asset1,
  asset2,
  isStock,
  children,
}) {
  const history = useHistory();
  const modalLink = TradeTokensModal.createHash({ asset1, asset2 });
  return (
    <Button
      primary
      onClick={() => history.push(
        `${isStock ? router.wallet.stockExchange : router.wallet.exchange}#${modalLink}`,
      )}
    >
      {children}
    </Button>
  );
}

TradeButton.propTypes = {
  asset1: PropTypes.string.isRequired,
  asset2: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isStock: PropTypes.bool,
};
