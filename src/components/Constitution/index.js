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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const allArticles = useSelector(lawSelectors.currentLawsSelector);
  const constitutionalChange = useSelector(lawSelectors.constitutionalChangeSelector);
  const legislation = useSelector(lawSelectors.legislationSelector);
  const decision = useSelector(lawSelectors.decisionSelector);
  const dispatch = useDispatch();

  const selectedArticles = (selected) => {
    switch (selected) {
      case 'ConstitutionalChange': return constitutionalChange;
      case 'Legislation': return legislation;
      case 'Decision': return decision;
      default: return allArticles;
    }
  };

  const categories = [
    {
      id: 'ConstitutionalChange',
      title: 'Constitutional change',
      amountArticle: constitutionalChange.length,
      type: 'blue',
    },
    {
      id: 'Legislation',
      title: 'Legislation',
      amountArticle: legislation.length,
      type: 'green',
    },
    {
      id: 'Decision',
      title: 'Decision',
      amountArticle: decision.length,
      type: 'yellow',
    },
  ];

  const articlesColor = {
    ConstitutionalChange: 'blue',
    Legislation: 'green',
    Decision: 'yellow',
  };

  useEffect(() => {
    dispatch(lawsActions.getCurrentLaws.call());
  }, [dispatch]);

  return (
    <div className={styles.constitution}>
      <Card title="Main Articles" className={styles.article}>
        { selectedArticles() && (selectedArticles(selectedCategory).map((article) => (
          <Article
            key={article.id}
            type={articlesColor[article.draftType]}
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
