import React, { useState } from 'react';

import Card from '../Card';
import Article from './Article';
import NavigationCategory from './NavigationCategory';

import styles from './styles.module.scss';

const articles = [
  {
    id: 234,
    title: 'Article 1',
    lastUpdate: '13.04.2021',
    categoryId: 123,
  },
  {
    id: 235,
    title: 'Article 2',
    lastUpdate: '13.04.2021',
    categoryId: 124,
  },
  {
    id: 236,
    title: 'Article 3',
    lastUpdate: '13.04.2021',
    categoryId: 124,

  },
  {
    id: 237,
    title: 'Article 4',
    lastUpdate: '13.04.2021',
    categoryId: 125,

  },
  {
    id: 238,
    title: 'Article 5',
    lastUpdate: '13.04.2021',
    categoryId: 125,

  },
  {
    id: 239,
    title: 'Article 6',
    lastUpdate: '13.04.2021',
    categoryId: 126,

  },
  {
    id: 240,
    title: 'Article 7',
    lastUpdate: '13.04.2021',
    categoryId: 127,

  },
  {
    id: 241,
    title: 'Article 8',
    lastUpdate: '13.04.2021',
    categoryId: 130,

  },
];

const categories = [
  {
    id: 123,
    title: 'Category 1',
    amountArticle: 123,
    type: 'blue',
  },
  {
    id: 124,
    title: 'Category 2',
    amountArticle: 233,
    type: 'green',
  },
  {
    id: 125,
    title: 'Category 3',
    amountArticle: 123,
    type: 'yellow',
  },
  {
    id: 126,
    title: 'Category 4',
    amountArticle: 20,
    type: 'red',
  },
  {
    id: 127,
    title: 'Category 5',
    amountArticle: 42,
    type: 'blue',
  },
  {
    id: 128,
    title: 'Category 6',
    amountArticle: 453,
    type: 'green',
  },
  {
    id: 129,
    title: 'Category 7',
    amountArticle: 14,
    type: 'yellow',
  },
  {
    id: 130,
    title: 'Category 8',
    amountArticle: 15,
    type: 'red',
  },
];

const Constitution = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const getCategoryType = (categoryId) => categories
    .find((category) => category.id === categoryId).type;

  const getArticles = () => (selectedCategory
    ? articles.filter((article) => article.categoryId === selectedCategory)
    : articles);

  return (
    <div className={styles.constitution}>
      <Card title="Main Articles" className={styles.article}>
        {getArticles().map((article) => (
          <Article
            key={article.id}
            type={getCategoryType(article.categoryId)}
            article={article}
          />
        ))}
      </Card>
      <div className={styles.categoryNavigation}>
        <h3>Navigation</h3>
        { categories.map((category) => (
          <NavigationCategory
            key={category.id}
            category={category}
            setCategory={setSelectedCategory}
          />
        ))}
      </div>
    </div>
  );
};

export default Constitution;
