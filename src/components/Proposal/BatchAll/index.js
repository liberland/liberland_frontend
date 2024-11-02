import React from 'react';
import PropTypes from 'prop-types';
import { isFastTrackProposal } from '../utils';
import FastTrackedReferendum from '../FastTrackedReferendum';
import styles from '../styles.module.scss';

function BatchAll({ proposal, children, withId }) {
  const { args: [calls] } = proposal;
  if (isFastTrackProposal(proposal)) {
    return (
      <FastTrackedReferendum proposal={calls[0]} fastTrack={calls[1]}>
        {children}
      </FastTrackedReferendum>
    );
  }
  if (withId) {
    return (
      <div>
        List of proposals found in batch
        {' '}
        {withId}
        :
        <ul>
          {calls.map((call, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <li className={styles.batchItem} key={`proposal ${idx}`}>
              {children(call)}
            </li>
          ))}
        </ul>
      </div>
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
  withId: PropTypes.string,
};

export default BatchAll;
