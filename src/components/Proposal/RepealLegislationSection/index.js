import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import router from '../../../router';

function RepealLegislationSection({ proposal }) {
  const { args: [tier, { year, index }, section] } = proposal;
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
        {' '}
        - Section #
        {section.toNumber()}
      </Link>
    </div>
  );
}
RepealLegislationSection.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object({}),
};

export default RepealLegislationSection;
