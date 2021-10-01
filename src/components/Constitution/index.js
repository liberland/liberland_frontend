import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Card from '../Card';
import Article from './Article';
import NavigationCategory from './NavigationCategory';

import styles from './styles.module.scss';
import { lawsActions } from '../../redux/actions';
import { lawSelectors } from '../../redux/selectors';

const Constitution = () => {
  // eslint-disable-next-line no-unused-vars
  const [selectedCategory, setSelectedCategory] = useState('');
  const articles = useSelector(lawSelectors.currentLawsSelector);
  const constitutionalChange = useSelector(lawSelectors.constitutionalChangeSelector);
  const legislation = useSelector(lawSelectors.legislationSelector);
  const decision = useSelector(lawSelectors.decisionSelector);
  const dispatch = useDispatch();

  const categories = [
    {
      id: 'ConstitutionalChange',
      title: 'Constitutional change',
      amountArticle: constitutionalChange.length,
      type: 'blue',
      articles: constitutionalChange,
    },
    {
      id: 'Legislation',
      title: 'Legislation',
      amountArticle: legislation.length,
      type: 'green',
      articles: legislation,
    },
    {
      id: 'Decision',
      title: 'Decision',
      amountArticle: decision.length,
      type: 'yellow',
      articles: decision,
    },
  ];

  // eslint-disable-next-line no-console
  const getCategoryType = (categoryId) => (console.log('categoryId', categoryId));

  const getArticles = () => articles;

  useEffect(() => {
    dispatch(lawsActions.getCurrentLaws.call());
  }, [dispatch]);

  return (
    <div className={styles.constitution}>
      <Card title="Main Articles" className={styles.article}>
        { articles && (getArticles().map((article) => (
          <Article
            key={article.id}
            type={getCategoryType(article.categoryId)}
            article={article}
          />
        )))}
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
