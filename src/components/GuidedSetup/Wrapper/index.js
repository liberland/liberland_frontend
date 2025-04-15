import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'antd/es/modal';
import styles from './styles.module.scss';

export function GuidedSetupWrapper({ children, isLoading }) {
  return (
    <Modal
      open
      closable={false}
      maskClosable={false}
      footer={null}
      className={isLoading ? styles.loader : undefined}
    >
      {children}
    </Modal>
  );
}

GuidedSetupWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
};

export default GuidedSetupWrapper;
