import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import cx from 'classnames';
import { blockchainSelectors, democracySelectors, congressSelectors } from '../../../redux/selectors';
import ProposalItem from './Items/ProposalItem';
import Card from '../../Card';
import styles from './styles.module.scss';
import ReferendumItem from './Items/ReferendumItem';
import DispatchItem from './Items/DispatchItem';
import {
  VoteOnReferendumModal, UndelegateModal,
} from '../../Modals';
import { democracyActions, congressActions } from '../../../redux/actions';
import Button from '../../Button/Button';
import stylesPage from '../../../utils/pagesBase.module.scss';

function Referendum() {
  const [isModalOpenVote, setIsModalOpenVote] = useState(false);
  const [isModalOpenUndelegate, setIsModalOpenUndelegate] = useState(false);
  const [selectedReferendumInfo, setSelectedReferendumInfo] = useState({ name: 'Referendum' });
  const [selectedVoteType, setSelectedVoteType] = useState('Nay');
  const { handleSubmit, register } = useForm();
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

  return (
    <div className={cx(stylesPage.contentWrapper, styles.wrapper)}>
      <div>
        <h3 className={styles.title}>Referendums</h3>
        {
            delegatingTo
              ? (
                <div className={styles.proposeReferendumLine}>
                  (
                  Delegating to:
                  {' '}
                  {delegatingTo}
                  <Button small primary onClick={handleModalOpenUndelegate}>Undelegate</Button>
                  )
                </div>
              )
              : null
        }
        <div className={styles.overViewCard}>
          {
              democracy.democracy?.crossReferencedReferendumsData.map((referendum) => (
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
                    buttonVoteCallback={handleModalOpenVote}
                    referendumIndex={parseInt(referendum.index)}
                    blacklistMotion={referendum.blacklistMotion}
                    userIsMember={userIsMember}
                  />
                </Card>
              ))
            }
        </div>
      </div>
      <div>
        <h3 className={styles.title}>Proposals</h3>
        <div className={styles.overViewCard}>
          {
              democracy.democracy?.crossReferencedProposalsData.map((proposal) => (
                <Card className={stylesPage.overviewWrapper} key={proposal.index}>
                  <ProposalItem
                    centralizedDatas={proposal.centralizedDatas}
                    boundedCall={proposal.boundedCall}
                    blacklistMotion={proposal.blacklistMotion}
                    userIsMember={userIsMember}
                  />
                </Card>
              ))
            }
        </div>
      </div>
      <div>
        <h3 className={styles.title}>Dispatches</h3>
        <div className={styles.overViewCard}>
          {democracy.democracy?.scheduledCalls.map((item) => (
            <Card
              className={cx(stylesPage.overviewWrapper, styles.itemWrapper)}
              key={`${item.blockNumber.toString()}-${item.idx}`}
            >
              <DispatchItem
                item={item}
              />
            </Card>
          ))}
        </div>
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
