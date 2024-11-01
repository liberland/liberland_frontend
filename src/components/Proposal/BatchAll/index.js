import React from 'react';
import PropTypes from 'prop-types';
import { isFastTrackProposal } from '../utils';
import FastTrackedReferendum from '../FastTrackedReferendum';

function BatchAll({ proposal, children }) {
  const { args: [calls] } = proposal;
  if (isFastTrackProposal(proposal)) {
    return (
      <FastTrackedReferendum proposal={calls[0]} fastTrack={calls[1]}>
        {children}
      </FastTrackedReferendum>
    );
  }
  return calls.map((call, idx) => (
    // eslint-disable-next-line react/no-array-index-key
    <div key={`proposal ${idx}`}>
      {children(call)}
      <br />
    </div>
  ));
}

BatchAll.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
};

export default BatchAll;
