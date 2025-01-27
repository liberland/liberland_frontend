import React from 'react';
import CreateContract from '../CreateContract';
import modalWrapper from '../../../Modals/ModalWrapper';
import OpenModalButton from '../../../Modals/OpenModalButton';

function Button(props) {
  return <OpenModalButton text="Create Contract" primary {...props} />;
}

const CreateContractModal = modalWrapper(CreateContract, Button);

export default CreateContractModal;
