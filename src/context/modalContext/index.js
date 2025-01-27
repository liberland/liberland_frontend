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
  const [modals, setModals] = useState([]);

  const showModal = useCallback((content, props = {}) => {
    const id = `${Date.now()}-${Math.random()}`;
    setModals((prevModals) => [
      ...prevModals,
      { id, content, props },
    ]);
    return id;
  }, []);

  const closeLastNModals = useCallback((n = 1) => {
    setModals((prevModals) => prevModals.slice(0, -n));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const contextValue = useMemo(() => ({
    showModal,
    closeLastNModals,
    closeAllModals,
  }), [showModal, closeLastNModals, closeAllModals]);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modals.map(({ id, content, props }) => (
        <Modal
          key={id}
          open
          footer={null}
          closable={!!props?.onClose}
          maskClosable
          onCancel={() => {
            if (props?.onClose) props.onClose();
            setModals((prevModals) => prevModals.filter((modal) => modal.id !== id));
          }}
          {...props}
        >
          {content}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
}

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};
