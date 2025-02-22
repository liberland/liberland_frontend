import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import Button from '../../Button/Button';
import { blockchainActions, congressActions, validatorActions } from '../../../redux/actions';
import {
  congressSelectors,
} from '../../../redux/selectors';
import ProposeLegislationButton from '../ProposeLegislationButton';
import ProposeLegislationViaReferendumButton from '../ProposeLegislationViaReferendumButton';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import ProposeBudgetModalWrapper from '../../Modals/ProposeBudgetModal';
import Table from '../../Table';

export default function Overview() {
  const dispatch = useDispatch();

  const userIsMember = useSelector(congressSelectors.userIsMember);
  const userIsRunnersUp = useSelector(congressSelectors.userIsRunnersUp);
  const userIsCandidate = useSelector(congressSelectors.userIsCandidate);
  const userHasWalletCongressMember = useSelector(congressSelectors.userHasWalletCongressMember);
  const members = useSelector(congressSelectors.members);
  useEffect(() => {
    dispatch(congressActions.getCandidates.call());
    dispatch(congressActions.getMembers.call());
    dispatch(congressActions.getRunnersUp.call());
  }, [dispatch]);

  const userStatus = useMemo(() => {
    if (userIsMember) {
      return 'Member';
    }
    if (userIsCandidate) {
      return 'Candidate';
    }
    if (userIsRunnersUp) {
      return 'RunnerUp';
    }
    return 'None';
  }, [userIsMember, userIsCandidate, userIsRunnersUp]);

  const switchWallet = (walletAddress) => {
    dispatch(blockchainActions.setUserWallet.success(walletAddress));
    dispatch(validatorActions.getInfo.call());
    localStorage.removeItem('BlockchainAdress');
  };

  return (
    <Table
      title={(
        <Flex wrap gap="15px" justify="space-between">
          <Title level={2}>
            Congress members
          </Title>
          <Flex wrap gap="15px" align="center">
            {!userIsCandidate && !userIsMember && !userIsRunnersUp && (
              <Button
                primary
                onClick={() => dispatch(congressActions.applyForCongress.call())}
              >
                Apply for Congress
              </Button>
            )}
            {(userIsMember || userIsCandidate || userIsRunnersUp) && (
              <Button
                onClick={() => dispatch(congressActions.renounceCandidacy.call(userStatus))}
              >
                Renounce
                {userIsMember ? ' Congress Membership' : null}
                {userIsCandidate || userIsRunnersUp ? ' Candidacy' : null}
              </Button>
            )}
          </Flex>
        </Flex>
      )}
      footer={(
        <Flex wrap gap="15px" justify="end">
          {userIsMember && (
            <>
              <ProposeLegislationButton />
              <ProposeLegislationViaReferendumButton />
              <ProposeBudgetModalWrapper />
            </>
          )}
          {userHasWalletCongressMember && !userIsMember && (
            <Button
              primary
              onClick={
              () => switchWallet(userHasWalletCongressMember)
            }
            >
              Switch wallet to Congress Member
            </Button>
          )}
        </Flex>
      )}
      columns={[
        {
          Header: 'User name',
          accessor: 'name',
        },
        {
          Header: 'Full legal name',
          accessor: 'legal',
        },
        {
          Header: 'Address',
          accessor: 'address',
        },
      ]}
      data={members?.map((item) => {
        const { member, identity } = item;
        return {
          name: identity.identity?.name || 'Unknown',
          legal: identity.identity?.legal || 'Unknown',
          address: (
            <CopyIconWithAddress
              address={member}
            />
          ),
        };
      }) || []}
    />
  );
}
