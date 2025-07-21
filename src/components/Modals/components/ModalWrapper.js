import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useModal } from '../../../context/modalContext';

const modalWrapper = (ModalContent, ModalButton, { propsWrapper, matchHash, createHash } = {}) => {
  function WrappedComponent(props) {
    const { showModal, closeLastNModals } = useModal();
    const { isOpenOnRender, onClose } = props;
    const { hash } = useLocation();
    const openModal = useCallback((hashPart) => {
      showModal(
        <ModalContent
          {...props}
          onClose={() => {
            closeLastNModals(1);
            onClose?.();
          }}
        />,
        { ...propsWrapper, onClose },
        hashPart,
      );
    }, [closeLastNModals, props, showModal, onClose]);

    useEffect(() => {
      if (!ModalButton || isOpenOnRender) {
        openModal();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpenOnRender]);

    useEffect(() => {
      if (matchHash) {
        const hashPart = hash.split('#')[1];
        if (hashPart) {
          const decoded = window.atob(hashPart);
          try {
            const object = JSON.parse(decoded);
            if (matchHash(props, object)) {
              openModal(hashPart);
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
    onClose: PropTypes.func,
  };

  if (createHash) {
    WrappedComponent.createHash = (params) => window.btoa(JSON.stringify(createHash(params)));
  }

  return WrappedComponent;
};

export default modalWrapper;
