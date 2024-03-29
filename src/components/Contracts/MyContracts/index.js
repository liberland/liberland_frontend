import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { contractsSelectors } from '../../../redux/selectors';
import { contractsActions } from '../../../redux/actions';
import ContractsList from '../ContractsList';
import Button from '../../Button/Button';
import CreateContractModalWrapper from '../CreateContract';

function MyContracts() {
  const dispatch = useDispatch();
  const myContracts = useSelector(contractsSelectors.selectorMyContracts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModal = () => {
    setIsModalOpen((prevValue) => !prevValue);
  };

  useEffect(() => {
    dispatch(contractsActions.getMyContracts.call());
  }, [dispatch]);

  if (!myContracts) return <div>Loading...</div>;

  return (
    <>
      <Button onClick={handleModal} primary medium>Create Contract</Button>
      {myContracts.length < 1 ? <div>No data...</div> : <ContractsList contracts={myContracts} />}
      {isModalOpen && <CreateContractModalWrapper handleModal={handleModal} />}
    </>

  );
}

export default MyContracts;
