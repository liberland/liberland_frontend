import React from 'react';
import Progress from 'antd/es/progress';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function Unobtrusive({ progressBarRatio, inactive }) {
  return (
    <Progress
      type="line"
      format={() => null}
      percent={progressBarRatio}
      strokeColor="#F3CB28"
      strokeLinecap="butt"
      percentPosition={{ align: 'center', type: 'inner' }}
      className={classNames('unobtrusive', { 'unobtrusive--inactive': inactive })}
    />
  );
}

Unobtrusive.propTypes = {
  progressBarRatio: PropTypes.number.isRequired,
  inactive: PropTypes.bool,
};
