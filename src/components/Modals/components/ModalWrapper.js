import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useModal } from '../../../context/modalContext';

const modalWrapper = (ModalContent, ModalButton, propsWrapper) => {
  function WrappedComponent(props) {
    const { showModal, closeLastNModals } = useModal();
    const { isOpenOnRender } = props;

    const closeLastModal = useCallback(() => {
      showModal(
        <ModalContent {...props} onClose={() => closeLastNModals(1)} />,
        { ...propsWrapper },
      );
    }, [closeLastNModals, props, showModal]);

    useEffect(() => {
      if (!ModalButton || isOpenOnRender) {
        closeLastModal();
      }
    }, [closeLastModal, isOpenOnRender]);

    return ModalButton ? <ModalButton onClick={closeLastModal} {...props} /> : null;
  }

  WrappedComponent.propTypes = {
    isOpenOnRender: PropTypes.bool,
  };

  return WrappedComponent;
};

export default modalWrapper;
