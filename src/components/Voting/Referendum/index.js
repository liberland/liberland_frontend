import React, {
  useContext,
  useEffect,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from 'antd/es/alert';
import Collapse from 'antd/es/collapse';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import { NavLink } from 'react-router-dom';
import { AuthContext } from 'react-oauth2-code-pkce';
import {
  blockchainSelectors,
  democracySelectors,
  congressSelectors,
  userSelectors,
} from '../../../redux/selectors';
import ProposalItem from './Items/ProposalItem';
import ReferendumItem from './Items/ReferendumItem';
import DispatchItem from './Items/DispatchItem';
import { UndelegateModal } from '../../Modals';
import { democracyActions, congressActions, identityActions } from '../../../redux/actions';
import { useMotionContext } from '../../WalletCongresSenate/ContextMotions';
import Button from '../../Button/Button';
import router from '../../../router';

function Referendum() {
  const dispatch = useDispatch();
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const userIsMember = useSelector(congressSelectors.userIsMember);
  const { login } = useContext(AuthContext);
  const user = useSelector(userSelectors.selectUser);

  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);

  useEffect(() => {
    dispatch(congressActions.getMembers.call());
  }, [dispatch]);

  const handleSubmitVoteForm = (voteType, referendumInfo) => {
    dispatch(democracyActions.voteOnReferendum.call({ ...referendumInfo, voteType }));
  };
  const handleSubmitUndelegate = () => {
    dispatch(democracyActions.undelegate.call({ userWalletAddress }));
  };
  const delegatingTo = democracy.democracy?.userVotes?.Delegating?.target;
  const alreadyVoted = (referendum) => {
    if (referendum.allAye.map((v) => v.accountId.toString()).includes(userWalletAddress)) return 'Aye';
    if (referendum.allNay.map((v) => v.accountId.toString()).includes(userWalletAddress)) return 'Nay';
    return false;
  };
  const dispatchRef = useRef(null);
  const proposalRef = useRef(null);
  const { motionIds } = useMotionContext();

  useEffect(() => {
    dispatch(identityActions.getIdentityMotions.call(Array.from(new Set(motionIds))));
  }, [motionIds, dispatch, proposalRef, dispatchRef]);

  return (
    <Collapse
      defaultActiveKey={['referendums', 'proposals', 'dispatches']}
      collapsible="icon"
      items={[
        {
          key: 'referendums',
          label: 'Referendums',
          extra: (
            <Flex wrap gap="15px">
              {delegatingTo && (
                <>
                  <UndelegateModal
                    delegatee={delegatingTo}
                    onSubmitUndelegate={handleSubmitUndelegate}
                  />
                  <div>
                    Delegating to:
                    {' '}
                    {delegatingTo}
                  </div>
                </>
              )}
              {user ? (
                <NavLink
                  to={router.voting.addLegislation}
                >
                  Propose
                </NavLink>
              ) : (
                <Button
                  onClick={() => login()}
                  primary
                >
                  Log in to propose referenda
                </Button>
              )}
            </Flex>
          ),
          children: democracy.democracy?.crossReferencedReferendumsData?.length ? (
            <List
              dataSource={democracy.democracy.crossReferencedReferendumsData}
              renderItem={(referendum) => (
                <List.Item>
                  <ReferendumItem
                    centralizedDatas={referendum.centralizedDatas}
                    voted={{
                      yayVotes: referendum.votedAye,
                      nayVotes: referendum.votedNay,
                      votedTotal: referendum.votedTotal,
                    }}
                    hash={referendum.imageHash}
                    delegating={delegatingTo !== undefined}
                    alreadyVoted={alreadyVoted(referendum)}
                    proposal={referendum.image.proposal}
                    buttonVoteCallback={handleSubmitVoteForm}
                    referendumIndex={parseInt(referendum.index)}
                    blacklistMotion={referendum.blacklistMotion}
                    userIsMember={userIsMember}
                  />
                </List.Item>
              )}
            />
          ) : <Alert type="info" message="There are no active Referendums" />,
        },
        {
          key: 'proposals',
          label: 'Proposals',
          children: democracy.democracy?.crossReferencedProposalsData?.length ? (
            <List
              dataSource={democracy.democracy.crossReferencedProposalsData}
              renderItem={(proposal) => (
                <List.Item>
                  <ProposalItem
                    boundedCall={proposal.boundedCall}
                    id={proposal.index}
                  />
                </List.Item>
              )}
            />
          ) : <Alert type="info" message="There are no active Proposals" />,
        },
        {
          key: 'dispatches',
          label: 'Dispatches',
          children: democracy.democracy?.scheduledCalls?.length ? (
            <List
              dataSource={democracy.democracy.scheduledCalls}
              renderItem={(item) => (
                <List.Item>
                  <DispatchItem
                    item={item}
                  />
                </List.Item>
              )}
            />
          ) : <Alert type="info" message="There are no active Dispatches" />,
        },
      ]}
    />
  );
}

export default Referendum;
