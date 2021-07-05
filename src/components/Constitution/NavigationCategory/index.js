import React from 'react';

import styles from '../styles.module.scss';

const NavigationCategory = ({ category, setCategory, itemColorObject }) => (
  <div onClick={() => (setCategory(category.id))} className={styles[`${itemColorObject.color}CategoryItem`]}>
    <div>
      <img src={itemColorObject.srcImage} alt={`${itemColorObject.color} square`} />
    </div>
    <div>
      <h4>
        {category.title}
      </h4>
      <span>
        {category.amountArticle}
        {' '}
        Articles
      </span>
    </div>
  </div>
);

export default NavigationCategory;
