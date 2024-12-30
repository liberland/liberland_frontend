import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { blockchainSelectors, democracySelectors, congressSelectors } from '../../../redux/selectors';
import ProposalItem from './Items/ProposalItem';
import Card from '../../Card';
import styles from './styles.module.scss';
import ReferendumItem from './Items/ReferendumItem';
import DispatchItem from './Items/DispatchItem';
import { UndelegateModal } from '../../Modals';
import { democracyActions, congressActions, identityActions } from '../../../redux/actions';
import stylesPage from '../../../utils/pagesBase.module.scss';
import { useMotionContext } from '../../WalletCongresSenate/ContextMotions';

function Referendum() {
  const dispatch = useDispatch();
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const userIsMember = useSelector(congressSelectors.userIsMember);

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
    if (proposalRef.current || dispatchRef.current) {
      dispatch(identityActions.getIdentityMotions.call(Array.from(new Set(motionIds))));
    }
  }, [motionIds, dispatch, proposalRef, dispatchRef]);

  return (
    <div className={cx(stylesPage.contentWrapper, styles.wrapper)}>
      <div>
        <h3 className={styles.title}>Referendums</h3>
        {
            delegatingTo
              ? (
                <div className={styles.proposeReferendumLine}>
                  Delegating to:
                  {' '}
                  {delegatingTo}
                  {' '}
                  <UndelegateModal
                    delegatee={delegatingTo}
                    onSubmitUndelegate={handleSubmitUndelegate}
                  />
                </div>
              )
              : null
        }
        <div className={styles.overViewCard}>
          {democracy.democracy?.crossReferencedReferendumsData?.length > 0
            ? democracy.democracy?.crossReferencedReferendumsData.map((referendum) => (
              <Card className={stylesPage.overviewWrapper} key={referendum.index}>
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
              </Card>
            ))
            : 'There are no active Referendums'}
        </div>
      </div>
      <div>
        <h3 className={styles.title}>Proposals</h3>
        <div className={styles.overViewCard}>
          { democracy.democracy?.crossReferencedProposalsData?.length > 0
            ? democracy.democracy?.crossReferencedProposalsData.map((proposal, index) => (
              <div
                key={proposal.index}
                // eslint-disable-next-line no-unsafe-optional-chaining
                ref={democracy.democracy?.crossReferencedProposalsData?.length - 1 === index ? proposalRef : null}
              >
                <Card className={stylesPage.overviewWrapper}>
                  <ProposalItem
                    centralizedDatas={proposal.centralizedDatas}
                    boundedCall={proposal.boundedCall}
                    blacklistMotion={proposal.blacklistMotion}
                    userIsMember={userIsMember}
                  />
                </Card>

              </div>

            ))
            : 'There are no active Proposals'}
        </div>
      </div>
      <div>
        <h3 className={styles.title}>Dispatches</h3>
        <div className={styles.overViewCard}>
          {democracy.democracy?.scheduledCalls?.length > 0
            ? democracy.democracy?.scheduledCalls.map((item, index) => (
              <div
                // eslint-disable-next-line no-unsafe-optional-chaining
                ref={democracy.democracy?.scheduledCalls?.length - 1 === index ? dispatchRef : null}
                key={`${item.blockNumber.toString()}-${item.idx}`}
              >
                <Card
                  className={cx(stylesPage.overviewWrapper, styles.itemWrapper)}
                >
                  <DispatchItem
                    item={item}
                  />
                </Card>
              </div>

            )) : 'There are no active Dispatches'}
        </div>
      </div>
    </div>
  );
}
export default Referendum;
