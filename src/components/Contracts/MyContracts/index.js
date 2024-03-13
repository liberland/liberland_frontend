import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { contractsSelectors } from '../../../redux/selectors';
import { contractsActions } from '../../../redux/actions';
import LoadingNoDataWrapper from '../../LoadingNoDataWrapper';
import ContractsList from '../ContractsList';

function MyContracts() {
  const dispatch = useDispatch();
  const myContracts = useSelector(contractsSelectors.selectorMyContracts);

  useEffect(() => {
    dispatch(contractsActions.getMyContracts.call());
  }, [dispatch]);

  return (
    <LoadingNoDataWrapper length={myContracts?.length}>
      <ContractsList contracts={myContracts} />
    </LoadingNoDataWrapper>
  );
}

export default MyContracts;
