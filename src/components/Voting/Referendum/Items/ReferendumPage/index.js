import React, {
  useEffect,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Spin from 'antd/es/spin';
import uniq from 'lodash/uniq';
import {
  blockchainSelectors,
  congressSelectors,
} from '../../../../../redux/selectors';
import { democracyActions, congressActions, identityActions } from '../../../../../redux/actions';
import useDemocracyInfo from '../useDemocracyInfo';
import MissingItem from '../MissingItem';
import ReferendumPageDisplay from '../ReferendumPageDisplay';

function ReferendumPage() {
  const dispatch = useDispatch();
  const { info, hasLoaded } = useDemocracyInfo();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const userIsMember = useSelector(congressSelectors.userIsMember);
  const { referendumHash } = useParams();

  useEffect(() => {
    dispatch(congressActions.getMembers.call());
  }, [dispatch]);

  const handleSubmitVoteForm = (voteType, referendumInfo) => {
    dispatch(democracyActions.voteOnReferendum.call({ ...referendumInfo, voteType }));
  };
  const referendum = info?.crossReferencedReferendumsData?.find(({
    imageHash,
  }) => imageHash === referendumHash);

  const ayeList = useMemo(() => referendum?.allAye?.map(({ accountId }) => accountId.toString()) || [], [referendum]);
  const nayList = useMemo(() => referendum?.allNay?.map(({ accountId }) => accountId.toString()) || [], [referendum]);
  useEffect(() => {
    if (referendum) {
      dispatch(identityActions.getIdentityMotions.call(
        uniq([
          ...ayeList,
          ...nayList,
          ...referendum?.centralizedDatas?.map(({ proposerAddress }) => proposerAddress) || [],
        ]),
      ));
    }
  }, [referendum, ayeList, dispatch, nayList]);

  // Spinning forever is what this did when the hash in the link belonged to
  // a referendum that has since been decided; now it says so.
  if (!hasLoaded) {
    return <Spin />;
  }

  if (!referendum) {
    return <MissingItem kind="referendum" />;
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
      delegating={Boolean(info?.userVotes?.Delegating?.target)}
      alreadyVoted={aye || nay}
      proposal={referendum.image.proposal}
      buttonVoteCallback={handleSubmitVoteForm}
      referendumIndex={parseInt(referendum.index)}
      blacklistMotion={referendum.blacklistMotion}
      allAye={ayeList}
      allNay={nayList}
      userIsMember={userIsMember}
    />
  );
}

export default ReferendumPage;
