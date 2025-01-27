import React, { useCallback } from 'react';
import { useModal } from '../../context/modalContext';

const modalWrapper = (ModalContent, ModalButton, closeAll = false) => function WrappedComponent(props) {
  const { showModal, closeAllModals, closeLastNModals } = useModal();

  const closeAllOnClick = useCallback(() => {
    showModal(<ModalContent {...props} onClose={closeAllModals} />);
  }, [showModal, props, closeAllModals]);

  const closeLastModal = useCallback(() => {
    showModal(<ModalContent {...props} onClose={() => closeLastNModals(1)} />);
  }, [closeLastNModals, props, showModal]);

  return <ModalButton onClick={closeAll ? closeAllOnClick : closeLastModal} {...props} />;
};

export default modalWrapper;
