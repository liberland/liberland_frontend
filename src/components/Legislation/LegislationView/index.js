import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Alert from 'antd/es/alert';
import Splitter from 'antd/es/splitter';
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

  if (!legislation[tier]) return 'Loading...';

  const items = Object.entries(legislation[tier]).flatMap(([year, legislations]) => (
    Object.entries(legislations).map(([index, {
      id,
      sections,
      mainRepealMotion,
      mainRepealReferendum,
      mainRepealProposal,
    }]) => (
      <LegislationItem
        year={year}
        index={index}
        tier={tier}
        id={id}
        sections={sections}
        mainRepealProposalReferendum={{
          mainRepealMotion,
          mainRepealReferendum,
          mainRepealProposal,
        }}
        key={`${year}-${index}`}
      />
    ))));

  if (!items.length) {
    return <Alert type="info" message="No legislation found" />;
  }

  return (
    <Splitter layout="vertical">
      {items}
    </Splitter>
  );
}

export default LegislationView;
