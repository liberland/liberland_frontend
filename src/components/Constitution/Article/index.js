import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { ReactComponent as Icon } from '../../../assets/icons/blue-square.svg';
import styles from './styles.module.scss';

const Article = ({ article: { proposalName, updatedAt, shortDescription }, type }) => (
  <div className={cx(styles.singleArticle, styles[type])}>
    <div className={styles.round}>
      <Icon />
    </div>
    <div>
      <h3>
        {proposalName}
      </h3>
      <span>
        Last update
        {' '}
        {updatedAt}
      </span>
      <span>
        Short Description
        {' '}
        {shortDescription}
      </span>
    </div>
  </div>
);

Article.propTypes = {
  article: PropTypes.shape({
    proposalName: PropTypes.string.isRequired,
    shortDescription: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default Article;
