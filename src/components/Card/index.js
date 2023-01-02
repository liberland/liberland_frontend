import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

function Card({ title, children, className }) {
  return (
    <div className={cx(styles.card, className)}>
      <h3 className={styles.cardTitle}>{title}</h3>
      {children}
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};
Card.defaultProps = {
  children: [],
  className: '',
};
export default Card;
