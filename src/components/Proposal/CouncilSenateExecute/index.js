import React from 'react';
import PropTypes from 'prop-types';

function CouncilSenateExecute({ proposal, children }) {
  const { args: [calls] } = proposal;
  return (
    <div>
      Execute using
      {' '}
      {proposal.section === 'councilAccount' ? 'Congress' : 'Senate'}
      {' '}
      Wallet:
      {children(calls)}
    </div>
  );
}

CouncilSenateExecute.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
};

export default CouncilSenateExecute;
