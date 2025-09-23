import React from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { blockchainSelectors } from '../../../redux/selectors';
import { blockDurationMilis, delayForClosingWithMinScheduler } from './constants';
import { getRemainingTimeString } from './util';

function CouncilMotionCountdown({ motionEndBlockNumber }) {
  const currentBlockTimestamp = useSelector(blockchainSelectors.blockTimestamp);
  const currentBlockNumber = useSelector(blockchainSelectors.blockNumber);
  const remaining = motionEndBlockNumber - currentBlockNumber;
  const now = new Date(currentBlockTimestamp);
  const untilEnd = new Date(currentBlockTimestamp + (remaining * blockDurationMilis) - delayForClosingWithMinScheduler);

  if (untilEnd.getTime() <= now.getTime()) {
    return (
      <div>
        The voting period has ended on
        {' '}
        {format(untilEnd, 'dd. MM. yyyy HH:mm:ss')}
        .
      </div>
    );
  }

  return (
    <>
      <div>
        <b>Ends in:</b>
        {' '}
        {getRemainingTimeString({ now, untilEnd })}
      </div>
      <div>
        <b>End date:</b>
        {' '}
        {format(untilEnd, 'dd. MM. yyyy HH:mm:ss')}
      </div>
    </>
  );
}

CouncilMotionCountdown.propTypes = {
  motionEndBlockNumber: PropTypes.string.isRequired,
};

export default CouncilMotionCountdown;
