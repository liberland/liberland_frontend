import React from 'react';
import PropTypes from 'prop-types';
import Preimage from '../Preimage';

function Blacklist({ proposal, children }) {
  const hash = proposal.args[0];
  return (
    <div>
      Blacklist and cancel referendum proposal.
      {' '}
      { proposal.args[1].isSome && `Cancel ongoing referendum #${proposal.args[1].unwrap().toString()}.`}
      <Preimage hash={hash} len={null}>
        {children}
      </Preimage>
    </div>
  );
}

Blacklist.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
};

export default Blacklist;
