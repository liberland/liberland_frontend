import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ContractsList from '../ContractsList';
import { contractsSelectors } from '../../../redux/selectors';
import { contractsActions } from '../../../redux/actions';

function HomeContract() {
  const dispatch = useDispatch();
  const contracts = useSelector(contractsSelectors.selectorContracts);

  useEffect(() => {
    dispatch(contractsActions.getContracts.call());
  }, [dispatch]);

  if (!contracts) return <div>Loading...</div>;

  if (contracts.length < 1) {
    return <div>No data...</div>;
  }
  return (
    <ContractsList contracts={contracts} />
  );
}

export default HomeContract;
