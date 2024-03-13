import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { contractsSelectors } from '../../../redux/selectors';
import { contractsActions } from '../../../redux/actions';
import LoadingNoDataWrapper from '../../LoadingNoDataWrapper';
import ContractsList from '../ContractsList';

function Contract() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const contract = useSelector(contractsSelectors.selectorSingleContract);
  useEffect(() => {
    dispatch(contractsActions.getSingleContract.call({ id }));
  }, [dispatch]);
  if (!contract) return null;
  return (
    <LoadingNoDataWrapper length={[contract]?.length}>
      <ContractsList contracts={[contract]} isOneItem />
    </LoadingNoDataWrapper>
  );
}

export default Contract;
