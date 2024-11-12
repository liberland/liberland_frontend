import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Card from '../../Card';
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
    <Card className={stylesPage.overviewWrapper}>
      <b>
        <span>Senate Members:</span>
        <br />
        {userHasWalletSenateMember && !userIsMember && (
          <Button
            small
            primary
            onClick={
            () => switchWallet(userHasWalletSenateMember)
          }
          >
            Switch wallet to Senate Member
          </Button>
        )}
      </b>
      <br />
      <ul>
        {members
          && members.map((item, index) => {
            const { member, identity } = item;
            return (
              // eslint-disable-next-line react/no-array-index-key
              <li key={member + index}>
                <CopyIconWithAddress
                  address={member}
                  name={identity.identity?.name}
                  legal={identity.identity?.legal}
                />
              </li>
            );
          })}
      </ul>
    </Card>
  );
}
export default Overview;
