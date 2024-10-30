import React from 'react';
import PropTypes from 'prop-types';
import Preimage from '../Preimage';

function FastTrackedReferendum({ proposal, fastTrack }) {
  const { hash_: hash, len } = proposal.args[0].asLookup;
  const [, votingPeriodInBlocks, enactmentPeriodInBlocks] = fastTrack.args;
  const votingPeriodInDays = (votingPeriodInBlocks.toNumber() * 6) / 3600 / 24;
  const enactmentPeriodInDays = (enactmentPeriodInBlocks.toNumber() * 6) / 3600 / 24;
  return (
    <div>
      Immediately start new referendum with shortened Referendum and/or Enactment Period.
      <ul>
        <li>
          Referendum Period:
          {votingPeriodInDays}
          {' '}
          day(s)
        </li>
        <li>
          Enactment Period:
          {enactmentPeriodInDays}
          {' '}
          day(s)
        </li>
        <li>
          <Preimage {...{ hash, len }} />
        </li>
      </ul>
    </div>
  );
}

// eslint-disable-next-line react/forbid-prop-types
FastTrackedReferendum.propTypes = { proposal: PropTypes.object, fastTrack: PropTypes.object.isRequired };

export default FastTrackedReferendum;
