import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { ReactComponent as Icon } from '../../../assets/icons/blue-square.svg';
import styles from './styles.module.scss';

const Article = ({ article: { title, lastUpdate }, type }) => (
  <div className={cx(styles.singleArticle, styles[type])}>
    <div className={styles.round}>
      <Icon />
    </div>
    <div>
      <h3>
        {title}
      </h3>
      <span>
        Last update
        {' '}
        {lastUpdate}
      </span>
    </div>
  </div>
);

Article.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    lastUpdate: PropTypes.string.isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default Article;
