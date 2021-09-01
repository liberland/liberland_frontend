import React, { useState } from 'react';

// COMPONENTS
// import ModalRoot from './ModalRoot';
// import { TextInput } from '../InputComponents';
import Button from '../Button/Button';

// eslint-disable-next-line react/prop-types
const ChoseStakeModal = ({ closeModal }) => {
  const [modalShown, setModalShown] = useState(0);

  const ChoseStake = () => (
    <div>
      <Button
        medium
        onClick={() => setModalShown(1)}
      >
        Polka Stake LLM
      </Button>
      <Button
        medium
        onClick={() => setModalShown(2)}
      >
        Liberland Stake LLM
      </Button>
      <Button
        medium
        onClick={closeModal}
      >
        Cancel
      </Button>
    </div>
  );

  if (modalShown) return ChoseStake;

  return null;
};

export default ChoseStakeModal;
