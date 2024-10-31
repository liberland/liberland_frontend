import React from 'react';
import PropTypes from 'prop-types';

function Schedule({ proposal, children }) {
  const { args } = proposal;
  return (
    <div>
      Schedule call to be made on
      {' '}
      {args[0].toString()}
      :
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
