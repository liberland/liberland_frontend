import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { ReactComponent as Icon } from '../../../assets/icons/blue-square.svg';
import styles from './styles.module.scss';

const NavigationCategory = ({
  category: {
    id, title, type, amountArticle,
  }, setCategory,
}) => (
  <div
    onClick={() => (setCategory(id))}
    className={cx(styles.categoryItem, styles[type])}
  >
    <Icon />
    <div>
      <h4>
        {title}
      </h4>
      <span>
        {amountArticle}
        {' '}
        Articles
      </span>
    </div>
  </div>
);

NavigationCategory.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    amountArticle: PropTypes.number.isRequired,
  }).isRequired,
  setCategory: PropTypes.func.isRequired,
};

export default NavigationCategory;
