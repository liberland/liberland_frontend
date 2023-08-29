import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { validatorSelectors } from '../../../redux/selectors';
import { CreateValidatorModal } from '../../Modals';
import Button from '../../Button/Button';

export default function CreateValidatorButton() {
  const info = useSelector(validatorSelectors.info); // something else must call getInfo action
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(!isModalOpen);

  if (info.stash) return null; // stash exists - validator already created - use start/stop button instead

  return (
    <>
      <Button small secondary onClick={handleModalOpen}>
        Create Validator
      </Button>
      {isModalOpen && <CreateValidatorModal closeModal={handleModalOpen} />}
    </>
  );
}
