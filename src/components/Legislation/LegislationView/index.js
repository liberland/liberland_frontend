import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { legislationActions } from '../../../redux/actions';
import { legislationSelectors } from '../../../redux/selectors';
import Card from '../../Card';

import styles from './styles.module.scss';

const LegislationView = () => {
  const { tier } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(legislationActions.getLegislation.call(tier));
  }, [dispatch, tier, legislationActions]);

  const legislation = useSelector(legislationSelectors.legislation);

  if (!legislation[tier]) return 'Loading...';

  return legislation[tier].map((l) => (
    <Card className={styles.legislationCard} title={`#${l.index}`} key={l.index}>{l.content}</Card>
  ));
};

export default LegislationView;
