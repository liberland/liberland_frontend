import React, { useState } from 'react';
import Modal from 'antd/es/modal';
import PropTypes from 'prop-types';

function CloseableModal({
  children,
  onClose,
  className,
  classNames,
}) {
  const [open, setOpen] = useState(true);
  return (
    <Modal
      open={open}
      footer={null}
      closable
      maskClosable
      classNames={classNames}
      className={className}
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
  // eslint-disable-next-line react/forbid-prop-types
  classNames: PropTypes.object,
  className: PropTypes.string,
};

export default CloseableModal;
