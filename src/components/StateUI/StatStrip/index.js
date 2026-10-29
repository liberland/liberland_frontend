import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

/*
 * The Liberland State design language's statement strip.
 *
 * A row of figures under a state-yellow rule, divided by hairlines: an
 * uppercase label, a mono figure with its unit, and a note. The design opens
 * both the dashboard and the staking screen with it, so it lives here rather
 * than in either of them.
 *
 * A figure that has not loaded is an em dash, never a zero — on a screen of
 * balances a placeholder zero reads as a real amount.
 */

export const DASH = '—';

function StatStrip({ stats }) {
  return (
    <section className={styles.strip} aria-label="Summary">
      {stats.map(({
        key, label, value, unit, note, action,
      }) => (
        <div key={key || label} className={styles.cell}>
          <div className={styles.label}>{label}</div>
          <div className={styles.valueRow}>
            <span className={styles.value}>{value ?? DASH}</span>
            {unit ? <span className={styles.unit}>{unit}</span> : null}
          </div>
          {note ? <div className={styles.note}>{note}</div> : null}
          {action ? <div className={styles.action}>{action}</div> : null}
        </div>
      ))}
    </section>
  );
}

StatStrip.propTypes = {
  stats: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.node,
    unit: PropTypes.string,
    note: PropTypes.node,
    action: PropTypes.node,
  })).isRequired,
};

export default StatStrip;
