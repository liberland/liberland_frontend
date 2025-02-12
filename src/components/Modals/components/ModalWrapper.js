import React, { useCallback, useEffect } from 'react';
import { useModal } from '../../../context/modalContext';

const modalWrapper = (ModalContent, ModalButton, propsWrapper) => function WrappedComponent(props) {
  const { showModal, closeLastNModals } = useModal();

  const closeLastModal = useCallback(() => {
    showModal(
      <ModalContent {...props} onClose={() => closeLastNModals(1)} />,
      { ...propsWrapper },
    );
  }, [closeLastNModals, props, showModal]);

  useEffect(() => {
    if (!ModalButton) {
      closeLastModal();
    }
  }, [closeLastModal]);

  return ModalButton ? <ModalButton onClick={closeLastModal} {...props} /> : null;
};

export default modalWrapper;
