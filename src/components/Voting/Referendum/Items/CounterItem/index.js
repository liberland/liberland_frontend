import React from 'react';
import PropTypes from 'prop-types';
import Progress from 'antd/es/progress';
import Flex from 'antd/es/flex';
import Avatar from 'antd/es/avatar';
import Button from '../../../../Button/Button';
import { HashIndexType } from '../constants';

function CounterItem({
  ayes,
  nays,
  buttonVoteCallback,
  referendumData,
  alreadyVoted,
  delegating,
}) {
  return (
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
      </Flex>
      <Progress percent={ayes + nays} success={{ percent: ayes, strokeColor: '#7DC035' }} strokeColor="#FF0000" />
    </Flex>
  );
}

CounterItem.propTypes = {
  ayes: PropTypes.number.isRequired,
  nays: PropTypes.number.isRequired,
  delegating: PropTypes.bool.isRequired,
  alreadyVoted: PropTypes.bool.isRequired,
  buttonVoteCallback: PropTypes.func.isRequired,
  referendumData: HashIndexType.isRequired,
};

export default CounterItem;
