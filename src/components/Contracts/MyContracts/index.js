import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Alert from 'antd/es/alert';
import Collapse from 'antd/es/collapse';
import Spin from 'antd/es/spin';
import { blockchainSelectors, contractsSelectors } from '../../../redux/selectors';
import { contractsActions } from '../../../redux/actions';
import ContractsList from '../ContractsList';
import CreateContract from '../CreateContract';
import { useModal } from '../../../context/modalContext';
import Button from '../../Button/Button';

function MyContracts() {
  const dispatch = useDispatch();
  const { showModal, closeModal } = useModal();
  const myContracts = useSelector(contractsSelectors.selectorMyContracts);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  useEffect(() => {
    dispatch(contractsActions.getMyContracts.call());
  }, [dispatch, walletAddress]);

  const handleCreateContract = () => {
    showModal(<CreateContract isMyContracts closeModal={closeModal} />);
  };

  if (!myContracts) {
    return <Spin />;
  }

  return (
    <Collapse
      defaultActiveKey={['all']}
      collapsible="icon"
      items={[
        {
          key: 'all',
          label: 'My contracts',
          extra: (
            <Button
              onClick={handleCreateContract}
              primary
            >
              Create Contract
            </Button>
          ),
          children: myContracts.length < 1 ? (
            <Alert type="info" message="No contracts found" />
          ) : (
            <ContractsList contracts={myContracts} isMyContracts />
          ),
        },
      ]}
    />
  );
}

export default MyContracts;
