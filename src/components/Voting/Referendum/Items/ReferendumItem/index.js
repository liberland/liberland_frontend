import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Divider from 'antd/es/divider';
import Collapse from 'antd/es/collapse';
import Flex from 'antd/es/flex';
import Button from '../../../../Button/Button';
import truncate from '../../../../../utils/truncate';
import { congressActions } from '../../../../../redux/actions';
import Details from '../Details';
import { centralizedDatasType } from '../types';
import Discussions from '../Discussions';
import VoteButtonsContainer from '../VoteButtonsContainer';
import router from '../../../../../router';
import CopyIconWithAddress from '../../../../CopyIconWithAddress';
import CounterItem from '../CounterItem';

function ReferendumItem({
  centralizedDatas,
  voted,
  hash,
  alreadyVoted,
  buttonVoteCallback,
  referendumIndex,
  delegating,
  proposal,
  blacklistMotion,
  userIsMember,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { yayVotes, nayVotes, votedTotal } = voted;

  const blacklist = () => dispatch(
    congressActions.congressDemocracyBlacklist.call({
      hash,
      referendumIndex,
    }),
  );

  return (
    <Collapse
      defaultActiveKey={['proposal']}
      items={[{
        key: 'proposal',
        label: (
          <Flex wrap gap="15px">
            Proposal
            <CopyIconWithAddress address={hash} />
          </Flex>
        ),
        extra: (
          <Flex wrap gap="15px">
            <VoteButtonsContainer
              alreadyVoted={alreadyVoted}
              buttonVoteCallback={buttonVoteCallback}
              delegating={delegating}
              referendumData={{ id: hash, referendumIndex }}
            />
            {blacklistMotion && (
              <Button link onClick={() => history.push(`${router.congress.motions}#${blacklistMotion}`)}>
                Blacklist motion:
                {' '}
                {truncate(blacklistMotion, 13)}
              </Button>
            )}
            {!blacklistMotion && userIsMember && (
              <Button onClick={blacklist}>
                Cancel as congress
              </Button>
            )}
            <CounterItem votedTotal={votedTotal} votes={yayVotes} />
            <CounterItem votedTotal={votedTotal} votes={nayVotes} isNay />
          </Flex>
        ),
        children: (
          <>
            <Details proposal={proposal} />
            <Divider />
            {centralizedDatas?.length > 0 && (
              <Discussions centralizedDatas={centralizedDatas} />
            )}
          </>
        ),
      }]}
    />
  );
}

const votesTypes = {
  yayVotes: PropTypes.number.isRequired,
  nayVotes: PropTypes.number.isRequired,
  votedTotal: PropTypes.number.isRequired,
};

ReferendumItem.propTypes = {
  centralizedDatas: PropTypes.arrayOf(centralizedDatasType).isRequired,
  voted: votesTypes.isRequired,
  hash: PropTypes.string.isRequired,
  alreadyVoted: PropTypes.bool.isRequired,
  buttonVoteCallback: PropTypes.func.isRequired,
  referendumIndex: PropTypes.number.isRequired,
  delegating: PropTypes.bool.isRequired,
  blacklistMotion: PropTypes.string.isRequired,
  proposal: PropTypes.instanceOf(Map).isRequired,
  userIsMember: PropTypes.bool.isRequired,
};

export default ReferendumItem;
