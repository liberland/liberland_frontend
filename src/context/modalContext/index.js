import React, {
  createContext, useContext, useState, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export function ModalProvider({ children }) {
  const [modalContent, setModalContent] = useState(null);
  const [modalProps, setModalProps] = useState({});

  const showModal = useCallback((content, props = {}) => {
    setModalContent(content);
    setModalProps(props);
  }, []);

  const closeModal = useCallback(() => {
    if (modalProps?.onClose) {
      modalProps.onClose();
    }
    setModalContent(null);
    setModalProps({});
  }, [modalProps]);

  const contextValue = useMemo(
    () => ({ showModal, closeModal }),
    [showModal, closeModal],
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}

      <Modal
        open={!!modalContent}
        footer={null}
        closable={!!modalProps?.onClose}
        maskClosable
        onCancel={closeModal}
        {...modalProps}
      >
        {modalContent}
      </Modal>
    </ModalContext.Provider>
  );
}

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
