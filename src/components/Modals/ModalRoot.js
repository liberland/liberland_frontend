import React from 'react';
import Modal from 'antd/es/modal';
import PropTypes from 'prop-types';

function ModalRoot({ children }) {
  return (
    <Modal open footer={null} closable={false}>
      {children}
    </Modal>
  );
}

ModalRoot.propTypes = {
  children: PropTypes.node,
};

export default ModalRoot;
