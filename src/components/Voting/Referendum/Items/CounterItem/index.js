import React from 'react';
import PropTypes from 'prop-types';
import Progress from 'antd/es/progress';
import Flex from 'antd/es/flex';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Avatar from 'antd/es/avatar';
import Card from 'antd/es/card';
import Button from '../../../../Button/Button';
import { HashIndexType } from '../constants';
import router from '../../../../../router';
import truncate from '../../../../../utils/truncate';
import { congressActions } from '../../../../../redux/actions';
import styles from '../../../styles.module.scss';

function CounterItem({
  ayes,
  nays,
  buttonVoteCallback,
  referendumData,
  alreadyVoted,
  delegating,
  blacklistMotion,
  userIsMember,
}) {
  const history = useHistory();
  const { id, referendumIndex } = referendumData;
  const dispatch = useDispatch();
  const blacklist = () => dispatch(
    congressActions.congressDemocracyBlacklist.call({
      referendumIndex,
      hash: id,
    }),
  );

  return (
    <Card className={styles.referendum}>
      <Flex vertical gap="15px">
        <Flex align="center" wrap gap="15px">
          <Flex vertical gap="5px">
            <div className="description">
              Votes for
            </div>
            <Avatar size={19} style={{ backgroundColor: '#7DC035' }}>
              +
            </Avatar>
          </Flex>
          <Flex vertical gap="5px">
            <div className="description">
              Votes against
            </div>
            <Avatar size={19} style={{ backgroundColor: '#FF0000' }}>
              &#10005;
            </Avatar>
          </Flex>
          {!delegating && (
            <Flex gap="15px" justify="end">
              {alreadyVoted !== 'Aye' && (
                <Button green onClick={() => buttonVoteCallback('Aye', referendumData)}>
                  {alreadyVoted ? 'Change vote to Aye' : 'Vote for'}
                </Button>
              )}
              {alreadyVoted !== 'Nay' && (
                <Button red onClick={() => buttonVoteCallback('Nay', referendumData)}>
                  {alreadyVoted ? 'Change vote to Nay' : 'Vote against'}
                </Button>
              )}
            </Flex>
          )}
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
        </Flex>
        <Progress
          percent={100}
          success={{ percent: Math.round((100 * ayes) / (ayes + nays)), strokeColor: '#7DC035' }}
          strokeColor="#FF0000"
        />
      </Flex>
    </Card>
  );
}

CounterItem.propTypes = {
  ayes: PropTypes.number.isRequired,
  nays: PropTypes.number.isRequired,
  delegating: PropTypes.bool.isRequired,
  alreadyVoted: PropTypes.bool.isRequired,
  buttonVoteCallback: PropTypes.func.isRequired,
  referendumData: HashIndexType.isRequired,
  blacklistMotion: PropTypes.string,
  userIsMember: PropTypes.bool,
};

export default CounterItem;
