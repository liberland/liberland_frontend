import React from 'react';

import styles from '../styles.module.scss';

const Article = ({ article, image }) => (

  <div className={styles[`${image[0].color.color}SingleArticle`]}>
    <div className={styles.round}>
      <img src={image[0].color.srcImage} alt="Blue Square" />
    </div>
    <div>
      <h3>
        {article.title}
      </h3>
      <span>
        Last update
        {' '}
        {article.lastUpdate}
      </span>
    </div>
  </div>
);

export default Article;
