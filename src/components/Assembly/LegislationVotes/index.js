import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ProposalsVoteTable from '../ProposalsVoteTable';

import { assemblySelectors } from '../../../redux/selectors';
import { assemblyActions } from '../../../redux/actions';

const Legislation = () => {
  const dispatch = useDispatch();
  const legislationProposals = useSelector(assemblySelectors.legislationSelector);

  useEffect(() => {
    dispatch(assemblyActions.getLegislation.call('Legislation'));
  }, [dispatch]);

  return (
    <div>
      <ProposalsVoteTable currentProposals={legislationProposals} />
    </div>
  );
};

export default Legislation;
