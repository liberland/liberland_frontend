import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spin from 'antd/es/spin';
import Alert from 'antd/es/alert';
import ContractsList from '../ContractsList';
import { blockchainSelectors, contractsSelectors } from '../../../redux/selectors';
import { contractsActions } from '../../../redux/actions';

function HomeContract() {
  const dispatch = useDispatch();
  const contracts = useSelector(contractsSelectors.selectorContracts);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  useEffect(() => {
    dispatch(contractsActions.getContracts.call());
  }, [dispatch, walletAddress]);

  if (!contracts) {
    return <Spin />;
  }

  if (!contracts.length) {
    return <Alert type="info" message="No contracts found" />;
  }

  return (
    <ContractsList contracts={contracts} />
  );
}

export default HomeContract;
