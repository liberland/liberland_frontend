import React, {
  createContext, useContext, useState, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import Modal from 'antd/es/modal';
import uniqueId from 'lodash/uniqueId';

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

  const showModal = useCallback((content, props = {}, hash = undefined) => {
    const id = uniqueId('modal_');
    setModals((prevModals) => {
      const ignoreHash = hash && prevModals.some((modal) => modal.hash === hash);
      if (ignoreHash) {
        return prevModals;
      }
      return [
        ...prevModals,
        {
          id,
          content,
          props,
          hash,
        },
      ];
    });
    return id;
  }, []);

  const closeIdModal = useCallback((id) => {
    setModals((prevModals) => prevModals.filter((modal) => modal.id !== id));
  }, []);

  const closeLastNModals = useCallback((n = 1) => {
    setModals((prevModals) => prevModals.slice(0, -n));
  }, []);

  const contextValue = useMemo(() => ({
    showModal,
    closeLastNModals,
    closeIdModal,
  }), [showModal, closeLastNModals, closeIdModal]);
  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modals.map(({ id, content, props }) => (
        <Modal
          key={id}
          open
          footer={null}
          closable={!!props?.onClose}
          maskClosable={props.maskClosable !== false}
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
  onClose: PropTypes.func,
  maskClosable: PropTypes.bool,
  className: PropTypes.string,
  classNames: PropTypes.string,
};
