import React, { useEffect, useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { blockchainSelectors, democracySelectors } from '../../../redux/selectors';
import ProposalItem from './Items/ProposalItem';
import Card from '../../Card';
import styles from './styles.module.scss';
import ReferendumItem from './Items/ReferendumItem';
import DispatchItem from './Items/DispatchItem';
import {
  VoteOnReferendumModal, UndelegateModal,
} from '../../Modals';
import { democracyActions } from '../../../redux/actions';
import Button from '../../Button/Button';
import router from '../../../router';
import useUsersIdentity from '../../../hooks/usersIdentity/useUsersIdentity';
import useProposerList from '../../../hooks/usersIdentity/useProposersList';

function Referendum() {
  const [isModalOpenVote, setIsModalOpenVote] = useState(false);
  const [isModalOpenUndelegate, setIsModalOpenUndelegate] = useState(false);
  const [selectedReferendumInfo, setSelectedReferendumInfo] = useState({ name: 'Referendum' });
  const [selectedVoteType, setSelectedVoteType] = useState('Nay');
  const { handleSubmit, register } = useForm();
  const dispatch = useDispatch();
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);

  const handleModalOpenVote = (voteType, referendumInfo) => {
    setIsModalOpenVote(!isModalOpenVote);
    setSelectedReferendumInfo(referendumInfo);
    setSelectedVoteType(voteType);
  };
  const handleModalOpenUndelegate = () => {
    setIsModalOpenUndelegate(!isModalOpenUndelegate);
  };
  const handleSubmitVoteForm = (values) => {
    dispatch(democracyActions.voteOnReferendum.call({ ...values, voteType: selectedVoteType }));
    handleModalOpenVote();
  };
  const handleSubmitUndelegate = () => {
    dispatch(democracyActions.undelegate.call({ userWalletAddress }));
    handleModalOpenUndelegate();
  };
  const delegatingTo = democracy.democracy?.userVotes?.Delegating?.target;
  const alreadyVoted = (referendum) => {
    if (referendum.allAye.map((v) => v.accountId.toString()).includes(userWalletAddress)) return 'Aye';
    if (referendum.allNay.map((v) => v.accountId.toString()).includes(userWalletAddress)) return 'Nay';
    return false;
  };

  const crossReferencedProposalsData = democracy.democracy?.crossReferencedProposalsData || [];
  const crossReferencedReferendumsData = democracy.democracy?.crossReferencedReferendumsData || [];
  const proposersList = useProposerList(crossReferencedReferendumsData);
  const proposersList2 = useProposerList(crossReferencedProposalsData, true);
  const mergedProposersList = useMemo(() => [...proposersList, ...proposersList2], [proposersList, proposersList2]);
  const { usersList } = useUsersIdentity(mergedProposersList);

  return (
    <div>
      <div className={styles.referendumsSection}>
        <div className={styles.proposeReferendumLine}>
          {
            delegatingTo
              ? (
                <>
                  Delegating to:
                  {' '}
                  {delegatingTo}
                  <Button small primary onClick={handleModalOpenUndelegate}>Undelegate</Button>
                </>
              )
              : null
          }
          <NavLink
            className={styles.linkButton}
            to={router.voting.addLegislation}
          >
            <Button small primary>Propose</Button>
          </NavLink>
        </div>
        <Card title="Referendums" className={styles.referendumsCard}>
          <div>
            {
              crossReferencedReferendumsData.map((referendum) => (
                <ReferendumItem
                  usersList={usersList}
                  key={referendum.index}
                  centralizedDatas={referendum.centralizedDatas}
                  yayVotes={referendum.votedAye}
                  nayVotes={referendum.votedNay}
                  hash={referendum.imageHash}
                  delegating={delegatingTo !== undefined}
                  alreadyVoted={alreadyVoted(referendum)}
                  proposal={referendum.image.proposal}
                  buttonVoteCallback={handleModalOpenVote}
                  votingTimeLeft="Query system or something for this"
                  referendumIndex={parseInt(referendum.index)}
                  blacklistMotion={referendum.blacklistMotion}
                />
              ))
            }
          </div>
        </Card>
      </div>
      <div className={styles.referendumsSection}>
        <Card title="Proposals">
          <div>
            {
              crossReferencedProposalsData.map((proposal) => (
                <ProposalItem
                  usersList={usersList}
                  key={proposal.index}
                  proposer={proposal.proposer}
                  centralizedDatas={proposal.centralizedDatas}
                  boundedCall={proposal.boundedCall}
                  blacklistMotion={proposal.blacklistMotion}
                />
              ))
            }
          </div>
        </Card>
      </div>
      <div className={styles.referendumsSection}>
        <Card title="Dispatches">
          <div>
            {democracy.democracy?.scheduledCalls.map((item) => (
              <DispatchItem
                key={`${item.blockNumber.toString()}-${item.idx}`}
                item={item}
              />
            ))}
          </div>
        </Card>
      </div>
      {isModalOpenVote && (
        <VoteOnReferendumModal
          closeModal={handleModalOpenVote}
          handleSubmit={handleSubmit}
          register={register}
          referendumInfo={selectedReferendumInfo}
          voteType={selectedVoteType}
          onSubmitVote={handleSubmitVoteForm}
        />
      )}
      {isModalOpenUndelegate && (
        <UndelegateModal
          closeModal={handleModalOpenUndelegate}
          handleSubmit={handleSubmit}
          delegatee={delegatingTo}
          onSubmitUndelegate={handleSubmitUndelegate}
        />
      )}
    </div>
  );
}
export default Referendum;
