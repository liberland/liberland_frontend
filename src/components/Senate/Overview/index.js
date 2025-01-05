import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import List from 'antd/es/list';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import { blockchainActions, senateActions, validatorActions } from '../../../redux/actions';
import { senateSelectors } from '../../../redux/selectors';
import Button from '../../Button/Button';

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
    <List
      header="Senate members"
      extra={userHasWalletSenateMember && !userIsMember ? (
        <Button
          small
          primary
          onClick={
          () => switchWallet(userHasWalletSenateMember)
        }
        >
          Switch wallet to Senate Member
        </Button>
      ) : undefined}
      dataSource={members || []}
      renderItem={({ member, identity }) => (
        <List.Item>
          <List.Item
            title={(
              <CopyIconWithAddress
                address={member}
                name={identity.identity?.name}
                legal={identity.identity?.legal}
              />
            )}
          />
        </List.Item>
      )}
    />
  );
}

export default Overview;
