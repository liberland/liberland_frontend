import React from 'react';
import PropTypes from 'prop-types';
import { rollCall } from '../../../utils/motions';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import ColorAvatar from '../../ColorAvatar';
import styles from './styles.module.scss';

/*
 * Who voted how on a motion, and who has not voted at all.
 *
 * A chamber's votes are public — that is most of the point of a chamber —
 * but the screen only showed the two lists of members who had voted. The
 * name a reader is usually looking for is the one in neither list: a member
 * who has said nothing while the clock runs down. That one is now on the
 * page with the rest.
 *
 * Tokens only, so the one implementation reads in both design languages.
 */

const LABEL = {
  aye: 'Aye',
  nay: 'Nay',
  none: 'Not voted',
};

function RollCall({ motion, members, chamber }) {
  const { rows, counts } = rollCall(motion, members);

  if (!rows.length) return null;

  const house = chamber === 'senate' ? 'Senate' : 'Congress';

  return (
    <section className={styles.rollCall} data-testid="motion-roll-call">
      <div className={styles.head}>
        <h4 className={styles.title}>Roll call</h4>
        <span className={styles.caption}>
          {`${counts.aye} aye · ${counts.nay} nay · ${counts.none} not voted`}
        </span>
      </div>
      <p className={styles.note}>
        {`Every ${house} vote is recorded on the chain and public, including a seat that has not voted.`}
      </p>
      <ul className={styles.rows}>
        {rows.map((row) => (
          <li key={row.address} className={styles.row}>
            <ColorAvatar size={32} name={row.name || row.address} />
            <div className={styles.who}>
              <span className={styles.name}>
                {row.name || 'Unknown'}
                {!row.isMember && <span className={styles.former}> (no longer seated)</span>}
              </span>
              <span className={styles.address}>
                <CopyIconWithAddress isTruncate address={row.address} />
              </span>
            </div>
            <span className={`${styles.vote} ${styles[row.vote]}`}>{LABEL[row.vote]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

RollCall.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  motion: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  members: PropTypes.array,
  chamber: PropTypes.oneOf(['congress', 'senate']),
};

export default RollCall;
