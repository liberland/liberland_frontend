import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Result from 'antd/es/result';
import Collapse from 'antd/es/collapse';
import Spin from 'antd/es/spin';
import Divider from 'antd/es/divider';
import Flex from 'antd/es/flex';
import { useMediaQuery } from 'usehooks-ts';
import {
  blockchainSelectors,
  contractsSelectors,
} from '../../../redux/selectors';
import { contractsActions } from '../../../redux/actions';
import ContractsList from '../ContractsList';
import CreateContractModal from '../Modals/CreateContractModal';

function MyContracts() {
  const dispatch = useDispatch();
  const myContracts = useSelector(contractsSelectors.selectorMyContracts);
  const walletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 992px)');
  useEffect(() => {
    dispatch(contractsActions.getMyContracts.call());
  }, [dispatch, walletAddress]);

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
          extra: isBiggerThanSmallScreen ? <CreateContractModal isMyContracts /> : undefined,
          children: (
            <Flex vertical>
              {!isBiggerThanSmallScreen && (
                <>
                  <CreateContractModal isMyContracts />
                  <Divider />
                </>
              )}
              {myContracts.length < 1 ? (
                <Result status={404} title="No contracts found" />
              ) : (
                <ContractsList contracts={myContracts} />
              )}
            </Flex>
          ),
        },
      ]}
    />
  );
}

export default MyContracts;
