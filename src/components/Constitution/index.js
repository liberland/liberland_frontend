import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import Card from '../Card';
import Article from './Article';
import NavigationCategory from './NavigationCategory';

import styles from './styles.module.scss';
import blueSquareImage from '../../assets/icons/blue-square.svg';

const article = [
  {
    title: 'Article 1',
    lastUpdate: '13.04.2021',

  },
  {
    title: 'Article 2',
    lastUpdate: '13.04.2021',

  },
  {
    title: 'Article 3',
    lastUpdate: '13.04.2021',

  },
  {
    title: 'Article 4',
    lastUpdate: '13.04.2021',

  },
];

const category = [
  {
    id: 123,
    title: 'Category 1',
    amountArticle: 123,
  },
  {
    id: 124,
    title: 'Category 2',
    amountArticle: 233,
  },
  {
    id: 125,
    title: 'Category 3',
    amountArticle: 123,
  },
  {
    id: 126,
    title: 'Category 4',
    amountArticle: 20,
  },
  {
    id: 127,
    title: 'Category 5',
    amountArticle: 42,
  },
  {
    id: 128,
    title: 'Category 6',
    amountArticle: 453,
  },
  {
    id: 129,
    title: 'Category 7',
    amountArticle: 14,
  },
  {
    id: 130,
    title: 'Category 8',
    amountArticle: 15,
  },
];

const Constitution = () => {
  const setCategory = (id) => (
    // eslint-disable-next-line no-console
    console.log('SET id', id)
  );

  return (
    <div className={styles.constitution}>
      <Card title="Main Articles" className={styles.article}>
        {article.map((el) => (
          <Article key={uuidv4()} image={blueSquareImage} article={el} />
        ))}
      </Card>
      <div className={styles.categoryNavigation}>
        <h3>Navigation</h3>
        { category.map((el) => (
          <NavigationCategory
            key={uuidv4()}
            category={el}
            setCategory={setCategory}
            image={blueSquareImage}
          />
        ))}
      </div>
    </div>
  );
};

export default Constitution;
