import React from 'react';
import PropTypes from 'prop-types';
import Preimage from '../Preimage';

function Referendum({ proposal, children }) {
  const { hash_: hash, len } = proposal.args[0].asLookup;
  return (
    <div>
      Propose a new referendum with simplified tally rules (simple majority of votes).
      <Preimage {...{ hash, len }}>
        {children}
      </Preimage>
    </div>
  );
}

Referendum.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
};

export default Referendum;
