import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import router from '../../../router';

function RepealLegislation({ proposal }) {
  const { args: [tier, { year, index }] } = proposal;
  return (
    <div>
      Repeal legislation
      {' '}
      <Link to={`${router.home.legislation}/${tier.toString()}`}>
        {tier.toString()}
        {' '}
        -
        {' '}
        {year.toNumber()}
        /
        {index.toNumber()}
      </Link>
    </div>
  );
}

// eslint-disable-next-line react/forbid-prop-types
RepealLegislation.propTypes = { proposal: PropTypes.object };

export default RepealLegislation;
