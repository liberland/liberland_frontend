import React from 'react';
import PropTypes from 'prop-types';
import { Proposal } from '../../../../Proposal';
import Preimage from '../../../../Proposal/Preimage';

function Details({ proposal, isProposal }) {
  return isProposal ? (
    <Preimage {...{ ...proposal }} isDetailsHidden={false}>
      {(prop, noDetails) => (
        <Proposal proposal={prop} isDetailsHidden={noDetails} />
      )}
    </Preimage>
  ) : (
    <Proposal {...{ proposal }} isDetailsHidden={false} />
  );
}

Details.defaultProps = {
  isProposal: false,
};

Details.propTypes = {
  proposal: PropTypes.instanceOf(Map).isRequired,
  isProposal: PropTypes.bool,
};

export default Details;
