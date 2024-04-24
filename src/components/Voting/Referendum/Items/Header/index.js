import React from 'react';
import PropTypes from 'prop-types';
import styles from '../item.module.scss';
import Button from '../../../../Button/Button';
import CopyIconWithAddress from '../../../../CopyIconWithAddress';

function Header({
  hash, children, setIsHidden, isHidden, textButton,
}) {
  return (
    <div className={styles.header}>
      <span className={styles.title}>
        ID:
        {' '}
        <CopyIconWithAddress
          address={hash}
        />
      </span>
      <div className={styles.buttons}>
        {children}
        <Button
          className={styles.button}
          small
          secondary={isHidden}
          grey={!isHidden}
          onClick={() => setIsHidden((prevState) => !prevState)}
        >
          {!isHidden ? 'HIDE' : 'SHOW'}
          {' '}
          {textButton}
        </Button>
      </div>
    </div>
  );
}

Header.defaultProps = {
  textButton: 'REFERENDUM',
};

Header.propTypes = {
  hash: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  setIsHidden: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired,
  textButton: PropTypes.string,
};

export default Header;
