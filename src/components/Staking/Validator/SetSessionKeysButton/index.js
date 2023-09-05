import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import Button from '../../../Button/Button';
import { validatorActions } from '../../../../redux/actions';
import SetSessionKeysModal from '../../../Modals/SetSessionKeysModal';

export default function SetSessionKeysButton() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = ({ keys }) => {
    dispatch(validatorActions.setSessionKeys.call({ keys }));
    toggleModal();
  };

  return (
    <>
      <Button small primary onClick={toggleModal}>Change session keys</Button>
      {isModalOpen
            && <SetSessionKeysModal closeModal={toggleModal} onSubmit={handleSubmit} />}
    </>
  );
}
