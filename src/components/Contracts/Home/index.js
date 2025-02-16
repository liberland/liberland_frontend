import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spin from 'antd/es/spin';
import Result from 'antd/es/result';
import Collapse from 'antd/es/collapse';
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
    return <Result status={404} title="No contracts found" />;
  }

  return (
    <Collapse
      collapsible="icon"
      defaultActiveKey={['all']}
      items={[
        {
          key: 'all',
          label: 'All contracts',
          children: (
            <ContractsList contracts={contracts} />
          ),
        },
      ]}
    />
  );
}

export default HomeContract;
