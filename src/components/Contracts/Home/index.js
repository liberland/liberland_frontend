import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ContractsList from '../ContractsList';
import LoadingNoDataWrapper from '../../LoadingNoDataWrapper';
import { contractsSelectors } from '../../../redux/selectors';
import { contractsActions } from '../../../redux/actions';

function HomeContract() {
  const dispatch = useDispatch();
  const contracts = useSelector(contractsSelectors.selectorContracts);

  useEffect(() => {
    dispatch(contractsActions.getContracts.call());
  }, [dispatch]);

  return (
    <LoadingNoDataWrapper length={contracts?.length}>
      <ContractsList contracts={contracts} />
    </LoadingNoDataWrapper>
  );
}

export default HomeContract;
