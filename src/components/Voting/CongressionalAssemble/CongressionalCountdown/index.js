import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { formatDistance, format } from 'date-fns';
import congressionalCountdown from './styles.module.scss';
import Card from '../../../Card';
import {
  blockchainSelectors,
} from '../../../../redux/selectors';
import stylesPage from '../../../../utils/pagesBase.module.scss';

function CongressionalCountdown({ termDuration }) {
  const currentBlockTimestamp = useSelector(blockchainSelectors.blockTimestamp);
  const currentBlockNumber = useSelector(blockchainSelectors.blockNumber);
  const remaining = currentBlockNumber % termDuration;
  const blockDurationMilis = 6000;
  const untilEnd = new Date(currentBlockTimestamp + (remaining * blockDurationMilis));

  const ratio = Math.round(100 * (1 - (remaining / termDuration)));

  return (
    <Card className={stylesPage.overviewWrapper} title="Countdown until end of election">
      <div className={congressionalCountdown.countdown}>
        Election ends in
        {' '}
        {formatDistance(
          untilEnd,
          new Date(currentBlockTimestamp),
          {
            addSuffix: true,
          },
        )}
      </div>
      <time dateTime={untilEnd.toString()} className={congressionalCountdown.countdown}>
        Election end date:
        {' '}
        {format(untilEnd, 'd. M. yyyy')}
      </time>
      <div className={congressionalCountdown.progressContainer}>
        <progress value={ratio} max={100} aria-label="progress in percent" />
      </div>
    </Card>
  );
}

CongressionalCountdown.propTypes = {
  termDuration: PropTypes.number.isRequired,
};

export default CongressionalCountdown;
