import React from 'react';
import PropTypes from 'prop-types';
import { Proposal } from '..';
import FastTrackedReferendum from '../FastTrackedReferendum';

function BatchAll({ proposal }) {
  function fastTrackMatches(prop, fastTrack) {
    const fastTrackHash = fastTrack.args[0];
    const p = prop.args[0];
    if (p.isLookup) return p.asLookup.hash_.eq(fastTrackHash);

    // our FE only uses Lookup
    return false;
  }

  const { args: [calls] } = proposal;
  if (calls.length === 2
    && calls[0].section === 'democracy'
    && calls[0].method === 'externalPropose'
    && calls[1].section === 'democracy'
    && calls[1].method === 'fastTrack'
    && fastTrackMatches(calls[0], calls[1])) {
    return <FastTrackedReferendum proposal={calls[0]} fastTrack={calls[1]} />;
  }
  return calls.map((call, idx) => (
    // eslint-disable-next-line react/no-array-index-key
    <div key={`proposal ${idx}`}>
      <Proposal proposal={call} />
      <br />
    </div>
  ));
}

// eslint-disable-next-line react/forbid-prop-types
BatchAll.propTypes = { proposal: PropTypes.object.isRequired };

export default BatchAll;
