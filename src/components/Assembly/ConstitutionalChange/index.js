import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ProposalsVoteTable from '../ProposalsVoteTable';

import { assemblySelectors } from '../../../redux/selectors';
import { assemblyActions } from '../../../redux/actions';

const ConstitutionalChange = () => {
  const dispatch = useDispatch();
  const constitutionalChangeProposals = useSelector(assemblySelectors.constitutionalChangeSelector);

  useEffect(() => {
    dispatch(assemblyActions.getConstitutionalChange.call('ConstitutionalChange'));
  }, [dispatch]);

  return (
    <div>
      <ProposalsVoteTable currentProposals={constitutionalChangeProposals} />
    </div>
  );
};

export default ConstitutionalChange;
