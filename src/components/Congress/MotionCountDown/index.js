import React from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import { blockchainSelectors } from '../../../redux/selectors';
import { blockDurationMilis, dateTimeFormat, delayForClosingWithMinScheduler } from './constants';
import { getRemainingTimeString } from './util';

function CouncilMotionCountdown({ motionEndBlockNumber }) {
  const currentBlockTimestamp = useSelector(blockchainSelectors.blockTimestamp);
  const currentBlockNumber = useSelector(blockchainSelectors.blockNumber);
  const remaining = motionEndBlockNumber - currentBlockNumber;
  const now = new Date(currentBlockTimestamp);
  const scheduleCallDate = new Date(currentBlockTimestamp + (remaining * blockDurationMilis));
  const untilEnd = new Date(currentBlockTimestamp + (remaining * blockDurationMilis) - delayForClosingWithMinScheduler);

  const scheduled = (
    <div>
      Schedule call to be made on:
      {' '}
      {format(scheduleCallDate, dateTimeFormat)}
    </div>
  );

  if (untilEnd.getTime() <= now.getTime()) {
    return (
      <Flex vertical>
        {scheduled}
        <div>
          The voting period has ended on
          {' '}
          {format(untilEnd, dateTimeFormat)}
          .
        </div>
      </Flex>
    );
  }

  return (
    <Flex vertical>
      {scheduled}
      <div>
        <strong>Ends in:</strong>
        {' '}
        {getRemainingTimeString({ now, untilEnd })}
      </div>
      <div>
        <strong>End date:</strong>
        {' '}
        {format(untilEnd, dateTimeFormat)}
      </div>
    </Flex>
  );
}

CouncilMotionCountdown.propTypes = {
  motionEndBlockNumber: PropTypes.string.isRequired,
};

export default CouncilMotionCountdown;
