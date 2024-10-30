import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import router from '../../../router';
import styles from '../styles.module.scss';

function AmendLegislation({ proposal }) {
  const { args: [tier, { year, index }, section, newContent] } = proposal;
  return (
    <div>
      <p>
        Amend or add legislation section
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
        .
      </p>
      <p>New content:</p>
      <p className={styles.legislationContent}>{newContent.toHuman()}</p>
    </div>
  );
}
// eslint-disable-next-line react/forbid-prop-types
AmendLegislation.propTypes = { proposal: PropTypes.object };

export default AmendLegislation;
