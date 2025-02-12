import React from 'react';
import modalWrapper from '../../../../Modals/components/ModalWrapper';
import ActionsMenu from '../ActionsMenu';
import OpenModalButton from '../../../../Modals/components/OpenModalButton';

function Button(props) {
  return <OpenModalButton text="Actions menu" nano primary {...props} />;
}

const AssetsMenuModal = modalWrapper(ActionsMenu, Button);

export default AssetsMenuModal;
