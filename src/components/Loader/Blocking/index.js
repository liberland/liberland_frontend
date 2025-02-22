import React from 'react';
import Progress from 'antd/es/progress';
import PropTypes from 'prop-types';

export default function Blocking({ progressBarRatio }) {
  return (
    <Progress type="circle" percent={progressBarRatio} />
  );
}

Blocking.propTypes = {
  progressBarRatio: PropTypes.number.isRequired,
};
