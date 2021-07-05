import React from 'react';

import Card from '../Card';
import Article from './Article';
import NavigationCategory from './NavigationCategory';

import styles from './styles.module.scss';
import blueSquareImage from '../../assets/icons/blue-square.svg';
import greenSquareImage from '../../assets/icons/green-square.svg';
import yellowSquareImage from '../../assets/icons/yellow-square.svg';
import redSquareImage from '../../assets/icons/red-square.svg';

const articles = [
  {
    id: 234,
    title: 'Article 1',
    lastUpdate: '13.04.2021',

  },
  {
    id: 235,
    title: 'Article 2',
    lastUpdate: '13.04.2021',

  },
  {
    id: 236,
    title: 'Article 3',
    lastUpdate: '13.04.2021',

  },
  {
    id: 237,
    title: 'Article 4',
    lastUpdate: '13.04.2021',

  },
];

const categories = [
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

  const colorsObject = {
    0: {
      color: 'blue',
      srcImage: blueSquareImage,
    },
    1: {
      color: 'green',
      srcImage: greenSquareImage,
    },
    2: {
      color: 'yellow',
      srcImage: yellowSquareImage,
    },
    3: {
      color: 'red',
      srcImage: redSquareImage,
    },
  };

  return (
    <div className={styles.constitution}>
      <Card title="Main Articles" className={styles.article}>
        {articles.map((article) => (
          <Article key={article.id} image={blueSquareImage} article={article} />
        ))}
      </Card>
      <div className={styles.categoryNavigation}>
        <h3>Navigation</h3>
        { categories.map((category, index) => (
          <NavigationCategory
            key={category.id}
            category={category}
            setCategory={setCategory}
            itemColorObject={colorsObject[index % 4]}
          />
        ))}
      </div>
    </div>
  );
};

export default Constitution;
