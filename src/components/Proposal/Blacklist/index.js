import React from 'react';
import PropTypes from 'prop-types';
import Preimage from '../Preimage';

function Blacklist({ proposal }) {
  const hash = proposal.args[0];
  return (
    <div>
      Blacklist and cancel referendum proposal.
      {' '}
      { proposal.args[1].isSome && `Cancel ongoing referendum #${proposal.args[1].unwrap().toString()}.`}
      <Preimage hash={hash} len={null} />
    </div>
  );
}

// eslint-disable-next-line react/forbid-prop-types
Blacklist.propTypes = { proposal: PropTypes.object.isRequired };

export default Blacklist;
