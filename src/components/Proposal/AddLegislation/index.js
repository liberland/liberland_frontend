import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import PropTypes from 'prop-types';
import router from '../../../router';
import stylesAnim from '../../Voting/Referendum/Items/item.module.scss';
import styles from '../styles.module.scss';

function AddLegislation({ proposal, isDetailsHidden }) {
  const { args: [tier, { year, index }, sections] } = proposal;
  return (
    <div className={styles.text}>
      <p>
        Add new legislation
        {' '}
        <Link to={`${router.home.legislation}/${tier.toString()}`} className={styles.blue}>
          {tier.toString()}
        </Link>
        {' '}
        -
        {' '}
        {year.toNumber()}
        /
        {index.toNumber()}
        {!isDetailsHidden ? '.' : '...'}
      </p>
      <div className={cx(stylesAnim.anim, !isDetailsHidden ? stylesAnim.shown : stylesAnim.hidden)}>
        {sections.map((section, idx) => (
        // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={idx}>
            <p>
              Section #
              {idx}
            </p>
            <p className={styles.legislationContent}>{new TextDecoder('utf-8').decode(section)}</p>
          </React.Fragment>
        ))}
      </div>

    </div>
  );
}

AddLegislation.defaultProps = {
  isDetailsHidden: false,
};

AddLegislation.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object,
  isDetailsHidden: PropTypes.bool,
};

export default AddLegislation;
