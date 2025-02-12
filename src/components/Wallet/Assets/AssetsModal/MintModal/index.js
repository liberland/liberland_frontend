import React from 'react';
import PropTypes from 'prop-types';
import modalWrapper from '../../../../Modals/components/ModalWrapper';
import OpenModalButton from '../../../../Modals/components/OpenModalButton';
import { useStockContext } from '../../../StockContext';
import MintAssetForm from '../MintAssetForm';

function Button(props) {
  const { isStock } = useStockContext();
  return (
    <OpenModalButton
      text={isStock ? 'Issue stock' : 'Mint asset'}
      medium
      primary
      {...props}
    />
  );
}

Button.propTypes = {
  isCreate: PropTypes.bool.isRequired,
};

const MintModal = modalWrapper(MintAssetForm, Button);

export default MintModal;
