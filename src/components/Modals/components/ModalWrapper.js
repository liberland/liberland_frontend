import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useModal } from '../../../context/modalContext';

const modalWrapper = (ModalContent, ModalButton, propsWrapper, urlAutoOpen) => {
  function WrappedComponent(props) {
    const { showModal, closeLastNModals } = useModal();
    const { isOpenOnRender } = props;
    const { hash } = useLocation();

    const openModal = useCallback(() => {
      showModal(
        <ModalContent {...props} onClose={() => closeLastNModals(1)} />,
        { ...propsWrapper },
      );
    }, [closeLastNModals, props, showModal]);

    useEffect(() => {
      if (isOpenOnRender) {
        openModal();
      }
    }, [openModal, isOpenOnRender]);

    useEffect(() => {
      if (urlAutoOpen) {
        const hashPart = hash.split('#')[1];
        if (hashPart) {
          const decoded = window.atob(hashPart);
          try {
            const object = JSON.parse(decoded);
            if (urlAutoOpen(props, object)) {
              openModal();
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
          }
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hash]);

    return ModalButton ? <ModalButton onClick={openModal} {...props} /> : null;
  }

  WrappedComponent.propTypes = {
    isOpenOnRender: PropTypes.bool,
  };

  return WrappedComponent;
};

export default modalWrapper;
