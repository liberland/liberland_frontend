import React from 'react';
import PropTypes from 'prop-types';
import modalWrapper from '../../../../Modals/ModalWrapper';
import OpenModalButton from '../../../../Modals/OpenModalButton';
import { useStockContext } from '../../../StockContext';
import CreateOrUpdateAssetForm from '../CreateOrUpdateAssetForm';

function Button(props) {
  const { isStock } = useStockContext();
  const { isCreate } = props;
  return (
    <OpenModalButton
      text={isCreate ? `Create ${isStock ? 'stock' : 'asset'}` : 'Update'}
      medium
      primary
      {...props}
    />
  );
}

Button.propTypes = {
  isCreate: PropTypes.bool.isRequired,
};

const CreateOrUpdateAssetModal = modalWrapper(CreateOrUpdateAssetForm, Button);

export default CreateOrUpdateAssetModal;
