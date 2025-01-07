import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import styles from '../styles.module.scss';
import { legislationSelectors } from '../../../../redux/selectors';

function VetoStats({
  tier, id, section, isH2,
}) {
  const allLegislation = useSelector(legislationSelectors.legislation);
  const legislation = allLegislation[tier][id.year][id.index];
  const vetos = section !== null ? (legislation?.sections?.[section]?.vetos || []) : legislation.vetos;
  const citizens = useSelector(legislationSelectors.citizenCount);

  return (
    <div className={cx(styles.vetoedWrapper, !isH2 && styles.vetoedWrapperSection)}>
      <span className={styles.vetoedTitle}>Citizens vetoed:</span>
      <span>
        {vetos.length}
        /
        {citizens}
      </span>
    </div>
  );
}

VetoStats.defaultProps = {
  isH2: false,
};

VetoStats.propTypes = {
  tier: PropTypes.string.isRequired,
  id: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    year: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    index: PropTypes.object.isRequired,
  }).isRequired,
  section: PropTypes.number.isRequired,
  isH2: PropTypes.bool,
};

export default VetoStats;
