import React, {
  useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Spin from 'antd/es/spin';
import {
  blockchainSelectors,
  democracySelectors,
  congressSelectors,
} from '../../../../../redux/selectors';
import { democracyActions, congressActions } from '../../../../../redux/actions';
import ReferendumPageDisplay from '../ReferendumItem';

function ReferendumPage() {
  const dispatch = useDispatch();
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const userIsMember = useSelector(congressSelectors.userIsMember);
  const { referendumHash } = useParams();

  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);

  useEffect(() => {
    dispatch(congressActions.getMembers.call());
  }, [dispatch]);

  const handleSubmitVoteForm = (voteType, referendumInfo) => {
    dispatch(democracyActions.voteOnReferendum.call({ ...referendumInfo, voteType }));
  };
  const referendum = democracy.democracy?.crossReferencedReferendumsData?.find(({
    imageHash,
  }) => imageHash === referendumHash);

  if (!referendum) {
    return <Spin />;
  }

  const aye = referendum.allAye.some(({ accountId }) => accountId.toString() === userWalletAddress)
    ? 'Aye'
    : undefined;
  const nay = referendum.allNay.some(({ accountId }) => accountId.toString() === userWalletAddress)
    ? 'Nay'
    : undefined;

  return (
    <ReferendumPageDisplay
      centralizedDatas={referendum.centralizedDatas}
      voted={{
        yayVotes: referendum.votedAye,
        nayVotes: referendum.votedNay,
        votedTotal: referendum.votedTotal,
      }}
      hash={referendum.imageHash}
      delegating={Boolean(democracy.democracy?.userVotes?.Delegating?.target)}
      alreadyVoted={aye || nay}
      proposal={referendum.image.proposal}
      buttonVoteCallback={handleSubmitVoteForm}
      referendumIndex={parseInt(referendum.index)}
      blacklistMotion={referendum.blacklistMotion}
      allAye={referendum.allAye.map(({ accountId }) => accountId.toString())}
      allNay={referendum.allNay.map(({ accountId }) => accountId.toString())}
      userIsMember={userIsMember}
    />
  );
}

export default ReferendumPage;
