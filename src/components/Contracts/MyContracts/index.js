import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { blockchainSelectors, contractsSelectors } from '../../../redux/selectors';
import { contractsActions } from '../../../redux/actions';
import ContractsList from '../ContractsList';
import CreateContractModalWrapper from '../CreateContract';

function MyContracts() {
  const dispatch = useDispatch();
  const myContracts = useSelector(contractsSelectors.selectorMyContracts);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  useEffect(() => {
    dispatch(contractsActions.getMyContracts.call());
  }, [dispatch, walletAddress]);

  if (!myContracts) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <CreateContractModalWrapper />
      {myContracts.length < 1 ? (
        <div>No data...</div>
      ) : (
        <ContractsList contracts={myContracts} isMyContracts />
      )}
    </>

  );
}

export default MyContracts;
