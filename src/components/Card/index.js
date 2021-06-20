import React from 'react';
import cx from 'classnames';

import styles from './styles.module.scss';

const Card = ({ title, children, className }) => (
  <div className={cx(styles.card, className)}>
    <h3 className={styles.cardTitle}>{title}</h3>
    {children}
  </div>
);

export default Card;
