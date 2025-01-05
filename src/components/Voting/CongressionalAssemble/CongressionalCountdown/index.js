import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { intervalToDuration, format } from 'date-fns';
import Card from 'antd/es/card';
import Progress from 'antd/es/progress';
import Paragraph from 'antd/es/typography/Paragraph';
import congressionalCountdown from './styles.module.scss';
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

  const { days, hours } = intervalToDuration(
    {
      start: new Date(currentBlockTimestamp),
      end: untilEnd,
    },
  );

  return (
    <Card
      cover={(
        <Progress type="circle" percent={ratio} />
      )}
    >
      <Card.Meta
        title="Countdown until end of election"
        description={(
          <>
            <Paragraph>
              Election ends in
              {' '}
              {days === 1 && '1 day'}
              {days > 1 && `${days} days`}
              {hours === 1 && ' 1 hour'}
              {hours > 1 && ` ${hours} hours`}
              {!days && !hours && 'less than 1 hour'}
            </Paragraph>
            <time dateTime={untilEnd.toString()} className={congressionalCountdown.countdown}>
              Election end date:
              {' '}
              {format(untilEnd, 'd. M. yyyy')}
            </time>
          </>
        )}
      />
    </Card>
  );
}

CongressionalCountdown.propTypes = {
  termDuration: PropTypes.number.isRequired,
};

export default CongressionalCountdown;
