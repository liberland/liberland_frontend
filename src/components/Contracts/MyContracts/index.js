import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Alert from 'antd/es/alert';
import Flex from 'antd/es/flex';
import Spin from 'antd/es/spin';
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
    return <Spin />;
  }
  return (
    <Flex vertical gap="20px">
      <Flex wrap gap="15px" align="end">
        <CreateContractModalWrapper />
      </Flex>
      {myContracts.length < 1 ? (
        <Alert type="info" message="No contracts found" />
      ) : (
        <ContractsList contracts={myContracts} isMyContracts />
      )}
    </Flex>
  );
}

export default MyContracts;
