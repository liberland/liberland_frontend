import React from 'react';
import PropTypes from 'prop-types';
import CouncilMotionCountdown from '../../Congress/MotionCountDown';

function Schedule({ proposal, children }) {
  const { args } = proposal;
  const when = args[0];
  return (
    <div>
      Schedule call to be made on:
      {' '}
      {when.toString()}
      :
      <CouncilMotionCountdown motionEndBlockNumber={when} />
      <br />
      {children(args[3])}
    </div>
  );
}

Schedule.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
};

export default Schedule;
