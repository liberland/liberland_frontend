import React from 'react';
import PropTypes from 'prop-types';
import Divider from 'antd/es/divider';
import Collapse from 'antd/es/collapse';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import Title from 'antd/es/typography/Title';
import Details from '../Details';
import { centralizedDatasType } from '../types';
import Discussions from '../Discussions';
import CopyIconWithAddress from '../../../../CopyIconWithAddress';
import CounterItem from '../CounterItem';
import PersonBox from '../../../../PersonBox';

function ReferendumPageDisplay({
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
  allAye,
  allNay,
  identity,
}) {
  const { yayVotes, nayVotes } = voted;
  const { name, legal } = identity || {};

  return (
    <Flex vertical gap="20px">
      <Flex wrap gap="15px">
        <Title level={1}>
          Proposal
          {' #'}
          {referendumIndex}
          <CopyIconWithAddress address={hash} />
        </Title>
      </Flex>
      <Collapse
        defaultActiveKey={['details', 'voting', 'parties']}
        collapsible="icon"
        items={[
          {
            key: 'details',
            label: 'Referendum info',
            children: (
              <Flex vertical gap="5px">
                <Details proposal={proposal} />
                {centralizedDatas?.length > 0 && (
                  <>
                    <Divider />
                    <Discussions centralizedDatas={centralizedDatas} />
                  </>
                )}
              </Flex>
            ),
          },
          {
            key: 'voting',
            label: 'Voting',
            children: (
              <CounterItem
                ayes={yayVotes}
                nays={nayVotes}
                delegating={delegating}
                alreadyVoted={alreadyVoted}
                buttonVoteCallback={buttonVoteCallback}
                referendumData={{ id: hash, referendumIndex }}
                blacklistMotion={blacklistMotion}
                userIsMember={userIsMember}
              />
            ),
          },
          {
            key: 'parties',
            label: 'Relevant parties',
            children: (
              <List
                grid={{ gutter: 16, column: 3 }}
                className="threeColumnList"
                dataSource={[
                  ...allAye.map((address) => ({ aye: true, address })),
                  ...allNay.map((address) => ({ address })),
                ]}
                renderItem={({ address, aye }) => (
                  <PersonBox
                    address={address}
                    displayName={legal || name || 'Unknown'}
                    role={aye ? {
                      name: 'Voted for',
                      color: '#7DC035',
                    } : {
                      name: 'Voted against',
                      color: '#FF0000',
                    }}
                  />
                )}
              />
            ),
          },
        ]}
      />
    </Flex>
  );
}

const votesTypes = {
  yayVotes: PropTypes.number.isRequired,
  nayVotes: PropTypes.number.isRequired,
  votedTotal: PropTypes.number.isRequired,
};

ReferendumPageDisplay.propTypes = {
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
  allAye: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  allNay: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  identity: PropTypes.shape({ name: PropTypes.string, legal: PropTypes.string }),
};

export default ReferendumPageDisplay;
