import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles.module.scss';

export function GuidedSetupWrapper({ children }) {
  return (
    <div className={styles.guidedSetupWrapper}>
      <div className={styles.componentWrapper}>{children}</div>
    </div>
  );
}

GuidedSetupWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
