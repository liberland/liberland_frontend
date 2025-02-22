import React from 'react';
import Flex from 'antd/es/flex';
import PropTypes from 'prop-types';
import Button from '../../../../Button/Button';
import { HashIndexType } from '../constants';

function VoteButtons({ buttonVoteCallback, referendumInfo }) {
  return (
    <Flex wrap gap="15px">
      <Button
        green
        onClick={() => { buttonVoteCallback('Aye', referendumInfo); }}
      >
        Vote aye
      </Button>
      <Button
        red
        onClick={() => { buttonVoteCallback('Nay', referendumInfo); }}
      >
        Vote nay
      </Button>
    </Flex>
  );
}

VoteButtons.propTypes = {
  buttonVoteCallback: PropTypes.func.isRequired,
  referendumInfo: HashIndexType.isRequired,
};

export default VoteButtons;
