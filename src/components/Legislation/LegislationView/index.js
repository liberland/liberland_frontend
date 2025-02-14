import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Alert from 'antd/es/alert';
import Spin from 'antd/es/spin';
import { congressActions, legislationActions } from '../../../redux/actions';
import {
  legislationSelectors,
} from '../../../redux/selectors';
import LegislationItem from './LegislationItem';

function LegislationView() {
  const { tier } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(legislationActions.getLegislation.call({ tier }));
    dispatch(legislationActions.getCitizenCount.call());
    // required by RepealLegislationButton && CitizenProposeRepealLegislationButton
    dispatch(congressActions.getMembers.call());
  }, [dispatch, tier]);

  const legislation = useSelector(legislationSelectors.legislation);
  const items = useMemo(() => Object.entries(legislation[tier] || {}).flatMap(([year, legislations]) => (
    Object.entries(legislations).map(([index, {
      id,
      sections,
    }]) => (
      <LegislationItem
        year={year}
        index={index}
        tier={tier}
        id={id}
        sections={sections}
        key={`${year}-${index}`}
      />
    )))), [legislation, tier]);

  if (!legislation[tier]) {
    return <Spin />;
  }

  if (!items.length) {
    return <Alert type="info" message="No legislation found" />;
  }

  return (
    <div>
      {items}
    </div>
  );
}

export default LegislationView;
