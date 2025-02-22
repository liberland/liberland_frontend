import React from 'react';
import PropTypes from 'prop-types';
import AlreadyVotedButton from '../AlreadyVoteButton';
import VoteButtons from '../VoteButtons';
import { HashIndexType } from '../constants';

function VoteButtonsContainer({
  alreadyVoted, delegating, buttonVoteCallback, referendumData,
}) {
  if (alreadyVoted) {
    return (
      <AlreadyVotedButton
        buttonVoteCallback={buttonVoteCallback}
        referendumInfo={referendumData}
        alreadyVoted={alreadyVoted}
      />
    );
  }
  if (delegating) {
    return <span>Undelegate to vote individually</span>;
  }

  return (
    <VoteButtons buttonVoteCallback={buttonVoteCallback} referendumInfo={referendumData} />
  );
}

VoteButtonsContainer.propTypes = {
  alreadyVoted: PropTypes.bool.isRequired,
  buttonVoteCallback: PropTypes.func.isRequired,
  delegating: PropTypes.bool.isRequired,
  referendumData: HashIndexType.isRequired,
};

export default VoteButtonsContainer;
