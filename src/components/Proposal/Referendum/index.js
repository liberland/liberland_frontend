import React from 'react';
import PropTypes from 'prop-types';
import Preimage from '../Preimage';

function Referendum({ proposal }) {
  const { hash_: hash, len } = proposal.args[0].asLookup;
  return (
    <div>
      Propose a new referendum with simplified tally rules (simple majority of votes).
      <Preimage {...{ hash, len }} />
    </div>
  );
}

Referendum.propTypes = { proposal: PropTypes.isRequired };

export default Referendum;
