import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import styles from './styles.module.scss';
import Button from '../../Button/Button';

function Header({
  title, isH2, children, setIsHidden, isHidden, textButton,
}) {
  return (
    <div className={cx(styles.header, !isH2 && styles.headerSection)}>
      {isH2 ? <h2 className={styles.title}>{title}</h2> : <h3 className={cx(styles.title, styles.titleh3)}>{title}</h3>}
      <div className={styles.rightColumn}>
        {children}
        <Button
          className={cx(styles.button, !isH2 && styles.buttonSection)}
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
  isH2: false,
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  isH2: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  setIsHidden: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired,
  textButton: PropTypes.string.isRequired,
};

export default Header;
