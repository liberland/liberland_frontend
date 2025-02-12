import React, {
  useEffect,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Spin from 'antd/es/spin';
import {
  blockchainSelectors,
  democracySelectors,
  congressSelectors,
  identitySelectors,
} from '../../../../../redux/selectors';
import { democracyActions, congressActions, identityActions } from '../../../../../redux/actions';
import ReferendumPageDisplay from '../ReferendumPageDisplay';

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

  const ayeList = useMemo(() => referendum?.allAye.map(({ accountId }) => accountId.toString()) || [], [referendum]);
  const nayList = useMemo(() => referendum?.allNay.map(({ accountId }) => accountId.toString()) || [], [referendum]);

  useEffect(() => {
    dispatch(identityActions.getIdentityMotions.call([...ayeList, ...nayList]));
  }, [ayeList, dispatch, nayList]);

  const identities = useSelector(identitySelectors.selectorIdentityMotions);

  if (!referendum) {
    return <Spin />;
  }

  const aye = ayeList.includes(userWalletAddress)
    ? 'Aye'
    : undefined;
  const nay = nayList.includes(userWalletAddress)
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
      allAye={ayeList}
      allNay={nayList}
      userIsMember={userIsMember}
      identity={identities}
    />
  );
}

export default ReferendumPage;
