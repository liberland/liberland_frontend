import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

function BackgroundBlocker({ children }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => { (document.body.style.overflow = 'unset'); };
  }, []);

  return <div className={styles.backgroundBlocker}>{children}</div>;
}

export default BackgroundBlocker;

BackgroundBlocker.propTypes = {
  children: PropTypes.node.isRequired,
};
