import React from 'react';
import Flex from 'antd/es/flex';
import PropTypes from 'prop-types';
import CouncilMotionCountdown from '../../Congress/MotionCountDown';

function Schedule({ proposal, children }) {
  const { args } = proposal;
  const when = args[0];
  return (
    <Flex vertical gap="20px">
      <CouncilMotionCountdown motionEndBlockNumber={when.toString()} />
      {children(args[3])}
    </Flex>
  );
}

Schedule.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
};

export default Schedule;
