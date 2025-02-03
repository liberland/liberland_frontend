import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { intervalToDuration, formatDuration, format } from 'date-fns';
import Card from 'antd/es/card';
import Alert from 'antd/es/alert';
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
  const untilEnd = new Date(currentBlockTimestamp + (remaining * blockDurationMilis));

  const ratio = Math.round(100 * (1 - (remaining / termDuration)));

  const duration = intervalToDuration(
    {
      start: new Date(currentBlockTimestamp),
      end: untilEnd,
    },
  );

  return (
    <Flex vertical gap="20px">
      <Card
        title={`Election ends in ${formatDuration(duration)}`}
        className={styles.countdown}
      >
        <Card.Meta
          description={(
            <>
              Congress elections are ongoing and citizens votes will be tallied on
              {' '}
              <time dateTime={untilEnd.toString()}>
                Election end date:
                {' '}
                {format(untilEnd, 'd. M. yyyy')}
              </time>
            </>
          )}
        />
        <Progress type="line" trailColor="#ECEBF0" strokeColor="#EDC007" percent={100 - ratio} />
      </Card>
      <Alert
        type="warning"
        message={(
          <>
            Liberland uses the Phragmen algorithm to tally votes.
            Your votes will be distributed among your preferred candidates in the order set below.
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
