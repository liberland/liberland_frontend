import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { assemblySelectors } from '../../../redux/selectors';
import { assemblyActions } from '../../../redux/actions';
import ProposalsVoteTable from '../ProposalsVoteTable';

const Decision = () => {
  const dispatch = useDispatch();
  const decisionProposals = useSelector(assemblySelectors.decisionSelector);

  useEffect(() => {
    dispatch(assemblyActions.getDecision.call('Decision'));
  }, [dispatch]);

  return (
    <div>
      <ProposalsVoteTable currentProposals={decisionProposals} />
    </div>
  );
};

export default Decision;
