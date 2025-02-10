import React from 'react';
import Modal from 'antd/es/modal';
import PropTypes from 'prop-types';
import CloseableModal from './CloseableModal';

function ModalRoot({ children, onClose }) {
  if (onClose) {
    return (
      <CloseableModal onClose={onClose}>
        {children}
      </CloseableModal>
    );
  }

  return (
    <Modal
      open
      footer={null}
      closable={false}
      maskClosable={false}
    >
      {children}
    </Modal>
  );
}

ModalRoot.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
};

export default ModalRoot;
