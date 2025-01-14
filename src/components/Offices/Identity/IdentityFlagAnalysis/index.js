import React from 'react';
import PropTypes from 'prop-types';
import Space from 'antd/es/space';
import { ReactComponent as CancelIcon } from '../../../../assets/icons/cancel.svg';
import { ReactComponent as OkIcon } from '../../../../assets/icons/green-check.svg';

function IdentityFlagAnalysis({ identity, field }) {
  const [, citizen_value] = identity.info.additional.find(([key, _]) => key.eq(field)) || [];
  if (!citizen_value) {
    return (
      <div>
        Missing
        <Space />
        <CancelIcon />
      </div>
    );
  }

  if (citizen_value.isRaw && citizen_value.eq('1')) {
    return (
      <div>
        Valid
        <Space />
        <OkIcon />
      </div>
    );
  }
  return (
    <div>
      Invalid
      <Space />
      <CancelIcon />
    </div>
  );
}

IdentityFlagAnalysis.propTypes = {
  identity: PropTypes.instanceOf(Map).isRequired,
  field: PropTypes.string.isRequired,
};

export default IdentityFlagAnalysis;
