import React from 'react';
import PropTypes from 'prop-types';
import truncate from '../../../../../utils/truncate';
import styles from '../item.module.scss';
import { ReactComponent as CopyIcon } from '../../../../../assets/icons/copy.svg';
import Button from '../../../../Button/Button';

function Header({
  hash, children, handleCopyClick, setIsHidden, isHidden, textButton,
}) {
  return (
    <div className={styles.header}>
      <span className={styles.title}>
        ID:
        {truncate(hash, 20)}
        {' '}
        <CopyIcon className={styles.copyIcon} name="proposalHash" onClick={() => handleCopyClick(hash)} />
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
  handleCopyClick: PropTypes.func.isRequired,
  setIsHidden: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired,
  textButton: PropTypes.string,
};

export default Header;
