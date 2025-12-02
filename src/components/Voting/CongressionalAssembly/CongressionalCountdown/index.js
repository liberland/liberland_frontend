import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { intervalToDuration, formatDuration, format } from 'date-fns';
import Card from 'antd/es/card';
import Result from 'antd/es/result';
import Flex from 'antd/es/flex';
import Progress from 'antd/es/progress';
import {
  blockchainSelectors,
} from '../../../../redux/selectors';
import styles from '../../styles.module.scss';

function CongressionalCountdown({ termDuration }) {
  const currentBlockTimestamp = useSelector(blockchainSelectors.blockTimestamp);
  const currentBlockNumber = useSelector(blockchainSelectors.blockNumber);
  const remaining = termDuration - (currentBlockNumber % termDuration);
  const blockDurationMilis = 6000;
  const now = new Date(currentBlockTimestamp);
  const untilEnd = new Date(currentBlockTimestamp + (remaining * blockDurationMilis));

  const duration = intervalToDuration(
    {
      start: now,
      end: untilEnd,
    },
  );

  const untilEndMillis = untilEnd.getTime() - now.getTime();
  const ratio = Math.round(100 * (1 - (untilEndMillis / (termDuration * blockDurationMilis))));

  return (
    <Flex vertical gap="20px">
      <Card
        size="small"
        title={(
          <time dateTime={untilEnd.toString()}>
            Election ends at
            {' '}
            {format(untilEnd, 'd. M. yyyy')}
            {' '}
            (
            {formatDuration(duration, {
              format: ['years', 'months', 'days', 'hours', 'minutes'],
              zero: false,
            })}
            )
          </time>
        )}
        className={styles.countdown}
      >
        <Progress type="line" trailColor="#ECEBF0" strokeColor="#EDC007" percent={ratio} />
      </Card>
      <Result
        status="warning"
        className="warning-result"
        title="Phragmen algorithm"
        icon={null}
        subTitle={(
          <>
            Liberland uses the Phragmen algorithm to tally votes.
            You can vote for multiple candidates and your votes are distributed
            to ensure that as many of your selected candidates get elected.
          </>
        )}
      />
    </Flex>
  );
}

CongressionalCountdown.propTypes = {
  termDuration: PropTypes.number.isRequired,
};

export default CongressionalCountdown;
