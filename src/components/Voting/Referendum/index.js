import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { blockchainSelectors, democracySelectors } from '../../../redux/selectors';
import ProposalItem from './Items/ProposalItem';
import Card from '../../Card';
import styles from './styles.module.scss';
import ReferendumItem from './Items/ReferendumItem';
import {
  VoteOnReferendumModal, ProposeReferendumModal, UndelegateModal,
} from '../../Modals';
import { democracyActions } from '../../../redux/actions';
import Button from '../../Button/Button';

function Referendum() {
  const [isModalOpenVote, setIsModalOpenVote] = useState(false);
  const [isModalOpenPropose, setIsModalOpenPropose] = useState(false);
  const [isModalOpenUndelegate, setIsModalOpenUndelegate] = useState(false);
  const [modalShown, setModalShown] = useState(1);
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
    setModalShown(1);
  };
  const handleModalOpenPropose = () => {
    setIsModalOpenPropose(!isModalOpenPropose);
  };
  const handleModalOpenUndelegate = () => {
    setIsModalOpenUndelegate(!isModalOpenUndelegate);
  };
  const handleModalOpenEndorse = (referendumInfo) => {
    setIsModalOpenVote(!isModalOpenVote);
    setSelectedReferendumInfo(referendumInfo);
    setModalShown(2);
  };
  const handleSubmitSecondForm = (values) => {
    dispatch(democracyActions.secondProposal.call(values));
    handleModalOpenEndorse();
  };
  const handleSubmitVoteForm = (values) => {
    dispatch(democracyActions.voteOnReferendum.call({ ...values, voteType: selectedVoteType }));
    handleModalOpenVote();
  };
  const handleSubmitPropose = (values) => {
    dispatch(democracyActions.propose.call({ values, userWalletAddress }));
    handleModalOpenPropose();
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
          <Button small primary onClick={handleModalOpenPropose}>Propose</Button>
        </div>
        <Card title="Referendums" className={styles.referendumsCard}>
          <div>
            {
              democracy.democracy?.crossReferencedReferendumsData.map((referendum) => (
                <ReferendumItem
                  key={referendum.index}
                  name={referendum?.centralizedData?.hash ? referendum.centralizedData.hash : 'Onchain referendum'}
                  createdBy={referendum?.centralizedData?.username ? referendum.centralizedData.username : 'Unknown'}
                  currentEndorsement="??"
                  externalLink={referendum?.centralizedData?.link
                    ? referendum.centralizedData.link
                    : 'https://forum.liberland.org/'}
                  description={referendum?.centralizedData?.description
                    ? referendum.centralizedData.description
                    : 'Onchain referendum with no description'}
                  yayVotes={referendum.votedAye}
                  nayVotes={referendum.votedNay}
                  hash={referendum.imageHash}
                  delegating={delegatingTo !== undefined}
                  alreadyVoted={alreadyVoted(referendum)}
                  buttonVoteCallback={handleModalOpenVote}
                  votingTimeLeft="Query system or something for this"
                  referendumIndex={parseInt(referendum.index)}
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
              democracy.democracy?.crossReferencedProposalsData.map((proposal) => (
                /* eslint-disable max-len */
                <ProposalItem
                  key={proposal.index}
                  name={proposal?.centralizedData?.hash ? proposal.centralizedData.hash : 'Onchain proposal'}
                  createdBy={proposal?.centralizedData?.username ? proposal.centralizedData.username : proposal.proposer}
                  currentEndorsement={`${proposal.seconds.length} Citizens supported`}
                  externalLink={proposal?.centralizedData?.link ? proposal.centralizedData.link : 'https://forum.liberland.org/'}
                  description={proposal?.centralizedData?.description ? proposal.centralizedData.description : 'Onchain proposal with no description'}
                  userDidEndorse={(proposal.seconds.includes(userWalletAddress) || proposal.proposer === userWalletAddress)}
                  boundedCall={proposal.boundedCall}
                  buttonEndorseCallback={handleModalOpenEndorse}
                  proposalIndex={proposal.index}
                />
                /* eslint-enable max-len */
              ))
            }
          </div>
        </Card>
      </div>
      <div className={styles.referendumsSection}>
        <Card title="Dispatches">
          <div />
          {isModalOpenVote && (
            <VoteOnReferendumModal
              closeModal={handleModalOpenVote}
              handleSubmit={handleSubmit}
              register={register}
              modalShown={modalShown}
              setModalShown={setModalShown}
              referendumInfo={selectedReferendumInfo}
              voteType={selectedVoteType}
              onSubmitSecond={handleSubmitSecondForm}
              onSubmitVote={handleSubmitVoteForm}
            />
          )}
          {isModalOpenPropose && (
            <ProposeReferendumModal
              closeModal={handleModalOpenPropose}
              onSubmitPropose={handleSubmitPropose}
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
        </Card>
      </div>
    </div>
  );
}
export default Referendum;
