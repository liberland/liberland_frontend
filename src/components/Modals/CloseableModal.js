import React, { useState } from 'react';
import Modal from 'antd/es/modal';
import PropTypes from 'prop-types';

function CloseableModal({
  children,
  onClose,
}) {
  const [open, setOpen] = useState(true);
  return (
    <Modal
      open={open}
      footer={null}
      closable
      maskClosable
      onCancel={() => {
        setOpen(false);
        onClose();
      }}
    >
      {children}
    </Modal>
  );
}

CloseableModal.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default CloseableModal;
