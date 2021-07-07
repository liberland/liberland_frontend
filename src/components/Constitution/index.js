
import React, { useState } from 'react';

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
    categoryId: 125,

  },
  {
    id: 237,
    title: 'Article 4',
    lastUpdate: '13.04.2021',
    categoryId: 126,

  },
  {
    id: 238,
    title: 'Article 5',
    lastUpdate: '13.04.2021',
    categoryId: 127,

  },
  {
    id: 239,
    title: 'Article 6',
    lastUpdate: '13.04.2021',
    categoryId: 128,

  },
  {
    id: 240,
    title: 'Article 7',
    lastUpdate: '13.04.2021',
    categoryId: 129,

  },
  {
    id: 241,
    title: 'Article 8',
    lastUpdate: '13.04.2021',
    categoryId: 130,

  },
];

let categories = [
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
  const [selectedCategory, setSelectedCategory] = useState('');

  const setCategory = (id) => (
    setSelectedCategory(id)
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

  categories = categories.map((category, index) => {
    // eslint-disable-next-line no-param-reassign
    category.color = colorsObject[index % 4];
    return (category);
  });

  return (
    <div className={styles.constitution}>
      <Card title="Main Articles" className={styles.article}>
        {articles.map((article) => (
          <Article
            key={article.id}
            image={selectedCategory
              ? (categories.filter((category) => selectedCategory === category.id))
              : ([{
                color: {
                  srcImage: blueSquareImage,
                  color: 'blue',
                },
              }])}
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
            setCategory={setCategory}
            itemColorObject={category.color}
          />
        ))}
      </div>
    </div>
  );
};

export default Constitution;
