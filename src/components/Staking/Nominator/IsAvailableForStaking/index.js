import React from 'react';
import PropTypes from 'prop-types';
import Tag from 'antd/es/tag';

function IsAvailableForStaking({
  blocked,
}) {
  return blocked ? (
    <Tag color="error">
      Blocked
    </Tag>
  ) : (
    <Tag color="success">
      Available
    </Tag>
  );
}

IsAvailableForStaking.propTypes = {
  blocked: PropTypes.bool,
};

export default IsAvailableForStaking;
