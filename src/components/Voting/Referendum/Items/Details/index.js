import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Switch from 'antd/es/switch';
import { Proposal } from '../../../../Proposal';
import Preimage from '../../../../Proposal/Preimage';

function Details({ proposal, isProposal }) {
  const [isDetailsHidden, setIsDetailsHidden] = useState(false);

  return (
    <Card
      title="Details"
      actions={[
        <Switch
          checkedChildren="Hide"
          unCheckedChildren="Show"
          checked={!isDetailsHidden}
          onChange={(checked) => setIsDetailsHidden(checked)}
        />,
      ]}
    >
      {isProposal ? (
        <Preimage {...{ ...proposal }} isDetailsHidden={isDetailsHidden}>
          {(prop, noDetails) => (
            <Proposal proposal={prop} isDetailsHidden={noDetails} />
          )}
        </Preimage>
      ) : <Proposal {...{ proposal }} isDetailsHidden={isDetailsHidden} />}
    </Card>
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
