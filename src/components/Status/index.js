import React from 'react';
import PropTypes from 'prop-types';
import Tag from 'antd/es/tag';

function Status({
  status,
  completed,
  declined,
  pending,
  className,
}) {
  const colors = {
    success: completed,
    error: declined,
    processing: pending,
  };
  return (
    <Tag color={Object.entries(colors).find(([_, value]) => value)?.[0] || 'default'} className={className}>
      {status}
    </Tag>
  );
}

Status.defaultProps = {
  completed: false,
  declined: false,
  pending: false,
  className: '',
};

Status.propTypes = {
  status: PropTypes.string.isRequired,
  completed: PropTypes.bool,
  declined: PropTypes.bool,
  pending: PropTypes.bool,
  className: PropTypes.string,
};

export default Status;
