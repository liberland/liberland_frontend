import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import { blockchainActions, senateActions, validatorActions } from '../../../redux/actions';
import { senateSelectors } from '../../../redux/selectors';
import Button from '../../Button/Button';
import Table from '../../Table';
import ProposeBudgetModalWrapper from '../../Modals/ProposeBudgetModal';

function Overview() {
  const dispatch = useDispatch();
  const members = useSelector(senateSelectors.members);
  const userHasWalletSenateMember = useSelector(senateSelectors.userHasWalletSenateMember);
  const userIsMember = useSelector(senateSelectors.userIsMember);

  useEffect(() => {
    dispatch(senateActions.senateGetMembers.call());
  }, [dispatch]);

  const switchWallet = (walletAddress) => {
    dispatch(blockchainActions.setUserWallet.success(walletAddress));
    dispatch(validatorActions.getInfo.call());
    localStorage.removeItem('BlockchainAdress');
  };

  return (
    <Table
      title={(
        <Title level={2}>
          Senate members
        </Title>
      )}
      footer={(
        <Flex wrap gap="15px" justify="end">
          {userIsMember && (
            <ProposeBudgetModalWrapper />
          )}
          {!userIsMember && userHasWalletSenateMember && (
            <Button
              primary
              onClick={() => switchWallet(userHasWalletSenateMember)}
            >
              Switch wallet to Senate Member
            </Button>
          )}
        </Flex>
      )}
      data={members?.map(
        ({ member, identity }) => ({
          address: <CopyIconWithAddress address={member} />,
          legal: identity.identity?.legal || 'Unknown',
          name: identity.identity?.name || 'Unknown',
        }),
      ) || []}
      columns={[
        {
          Header: 'Username',
          accessor: 'name',
        },
        {
          Header: 'Legal identity',
          accessor: 'legal',
        },
        {
          Header: 'Address',
          accessor: 'address',
        },
      ]}
    />
  );
}

export default Overview;
