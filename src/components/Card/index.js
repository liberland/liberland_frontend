import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';
import stylesPage from '../../utils/pagesBase.module.scss';

function Card({
  title, children, className, isNotBackground,
}) {
  return (
    <div className={cx(styles.card, className, isNotBackground && styles.backgroundNone)}>
      {title && <h3 className={stylesPage.cardTitle}>{title}</h3>}
      {children}
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  isNotBackground: PropTypes.bool,
};

Card.defaultProps = {
  title: null,
  children: [],
  className: '',
  isNotBackground: false,
};

export default Card;
