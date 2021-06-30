import React from 'react';

import style from '../styles.module.scss';

const NavigationCategory = ({ category, setCategory, image }) => (
  <div onClick={() => (setCategory(category.id))} className={style.categoryItem}>
    <div>
      <img src={image} alt="Blue Square" />
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
