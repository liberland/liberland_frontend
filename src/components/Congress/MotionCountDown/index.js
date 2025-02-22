import { useSelector } from 'react-redux';
import { format, intervalToDuration } from 'date-fns';
import React from 'react';
import PropTypes from 'prop-types';
import { blockchainSelectors } from '../../../redux/selectors';

function CouncilMotionCountdown({ motionEndBlockNumber }) {
  const currentBlockTimestamp = useSelector(blockchainSelectors.blockTimestamp);
  const currentBlockNumber = useSelector(blockchainSelectors.blockNumber);
  const blocksInDay = (3600 * 24) / 6;
  const delayForClosingWithMinScheduler = blocksInDay * 5; // 4 days min scheduler, 1 day for closing
  const blockDurationMilis = 6000;
  const remaining = motionEndBlockNumber
  - (currentBlockNumber % motionEndBlockNumber)
  - delayForClosingWithMinScheduler;
  const untilEndTimestamp = currentBlockTimestamp + (remaining * blockDurationMilis);
  const untilEnd = new Date(untilEndTimestamp);

  const now = new Date().getTime();
  if (untilEndTimestamp <= now) {
    return <div>The voting period has ended.</div>;
  }

  const {
    days, hours, minutes, seconds,
  } = intervalToDuration({
    start: now,
    end: untilEnd,
  });

  const getRemainingTimeString = () => {
    const parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    if (seconds > 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(' ') : 'less than 1 minute';
  };

  return (
    <>
      <div>
        <b>Ends in:</b>
        {' '}
        {getRemainingTimeString()}
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
