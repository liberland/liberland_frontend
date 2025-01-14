import React from 'react';
import Flex from 'antd/es/flex';
import PropTypes from 'prop-types';
import Button from '../../../../Button/Button';
import { HashIndexType } from '../constants';

function AlreadyVotedButton({ buttonVoteCallback, referendumInfo, alreadyVoted }) {
  if (alreadyVoted === 'Aye') {
    return (
      <Flex wrap gap="15px">
        <Flex vertical gap="15px">
          <div className="description">
            You voted:
          </div>
          <div className="value">
            Aye
          </div>
        </Flex>
        <Button
          red
          onClick={() => { buttonVoteCallback('Nay', referendumInfo); }}
        >
          Change vote to Nay
        </Button>
      </Flex>
    );
  }
  return (
    <Flex wrap gap="15px">
      <Flex vertical gap="15px">
        <div className="description">
          You voted:
        </div>
        <div className="value">
          Nay
        </div>
      </Flex>
      <Button
        red
        onClick={() => { buttonVoteCallback('Nay', referendumInfo); }}
      >
        Change vote to Aye
      </Button>
    </Flex>
  );
}

AlreadyVotedButton.propTypes = {
  buttonVoteCallback: PropTypes.func.isRequired,
  referendumInfo: HashIndexType.isRequired,
  alreadyVoted: PropTypes.bool.isRequired,
};

export default AlreadyVotedButton;
