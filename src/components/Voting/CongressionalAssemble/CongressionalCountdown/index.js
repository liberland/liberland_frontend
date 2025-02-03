import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { intervalToDuration, formatDuration, format } from 'date-fns';
import Card from 'antd/es/card';
import Progress from 'antd/es/progress';
import Paragraph from 'antd/es/typography/Paragraph';
import {
  blockchainSelectors,
} from '../../../../redux/selectors';

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
    <Card
      title="Countdown until end of election"
    >
      <Card.Meta
        description={(
          <>
            <Paragraph>
              Election ends in
              {' '}
              {formatDuration(duration)}
            </Paragraph>
            <Paragraph>
              <time dateTime={untilEnd.toString()}>
                Election end date:
                {' '}
                {format(untilEnd, 'd. M. yyyy')}
              </time>
            </Paragraph>
          </>
        )}
      />
      <Progress type="circle" percent={100 - ratio} />
    </Card>
  );
}

CongressionalCountdown.propTypes = {
  termDuration: PropTypes.number.isRequired,
};

export default CongressionalCountdown;
