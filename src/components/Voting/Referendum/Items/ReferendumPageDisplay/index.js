import React from 'react';
import PropTypes from 'prop-types';
import Divider from 'antd/es/divider';
import Collapse from 'antd/es/collapse';
import Flex from 'antd/es/flex';
import List from 'antd/es/list';
import Space from 'antd/es/space';
import Title from 'antd/es/typography/Title';
import { useSelector } from 'react-redux';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import { useHistory } from 'react-router-dom';
import Details from '../Details';
import { centralizedDatasType } from '../types';
import Discussions from '../Discussions';
import CopyIconWithAddress from '../../../../CopyIconWithAddress';
import CounterItem from '../CounterItem';
import PersonBox from '../../../../PersonBox';
import truncate from '../../../../../utils/truncate';
import { useHideTitle } from '../../../../Layout/HideTitle';
import styles from '../../../styles.module.scss';
import Button from '../../../../Button/Button';
import CopyInput from '../../../../CopyInput';
import router from '../../../../../router';
import { identitySelectors } from '../../../../../redux/selectors';

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
}) {
  const identities = useSelector(identitySelectors.selectorIdentityMotions);
  const { yayVotes, nayVotes } = voted;
  const history = useHistory();
  useHideTitle();
  const fullLink = `${window.location.protocol}//${window.location.host}${
    router.voting.referendumItem.replace(':referendumHash', hash.toString())}`;

  return (
    <Flex vertical gap="20px">
      <Flex className={styles.nav} wrap gap="15px" align="center">
        <Flex flex={1}>
          <Button onClick={() => history.goBack()}>
            <ArrowLeftOutlined />
            <Space />
            Back
          </Button>
        </Flex>
        <div>
          <CopyInput buttonLabel="Copy link to proposal" value={fullLink} />
        </div>
      </Flex>
      <Flex wrap gap="15px">
        <Title level={1}>
          Proposal
          {' '}
          {truncate(referendumIndex.toString(), 5)}
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
                renderItem={({ address, aye }) => {
                  const { name, legal } = identities?.[address]?.identity || {};
                  return (
                    <PersonBox
                      address={address}
                      displayName={truncate(legal || name || 'Unknown', 20)}
                      role={aye ? {
                        name: 'Voted for',
                        color: '#7DC035',
                      } : {
                        name: 'Voted against',
                        color: '#FF0000',
                      }}
                    />
                  );
                }}
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
};

export default ReferendumPageDisplay;
