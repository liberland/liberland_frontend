import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import router from '../../router';
import styles from './styles.module.scss';

/*
 * The republic as it stands: what the state is about to do, where its money
 * went, and how it is doing.
 *
 * This took the place of four hand-written news cards explaining what
 * Liberland is. A landing screen should answer the questions a person
 * arrived with, and none of those cards did; worse, they aged on their own,
 * so the newest one was already a year stale.
 *
 * Tokens only, so one implementation reads correctly in both the Ledger and
 * the State language. Each block states plainly when it has nothing to show
 * rather than disappearing, because a block that vanishes leaves a person
 * unsure whether it ran.
 */

/*
 * What an empty block says. "Still reading" and "we asked and got nothing"
 * are different facts, and a panel that shows the first forever when the
 * second is true is lying to the reader about a service being down.
 */
function waiting(hasAnswer, failed, empty, subject) {
  if (hasAnswer) return empty;
  if (failed) return `${subject.charAt(0).toUpperCase()}${subject.slice(1)} could not be read just now.`;
  return `Reading ${subject}…`;
}

function Block({ title, caption, children }) {
  return (
    <section className={styles.block}>
      <div className={styles.blockHead}>
        <h3 className={styles.blockTitle}>{title}</h3>
        {caption && <span className={styles.caption}>{caption}</span>}
      </div>
      {children}
    </section>
  );
}

Block.propTypes = {
  title: PropTypes.string.isRequired,
  caption: PropTypes.node,
  children: PropTypes.node,
};

function RepublicLive({
  scheduled, payments, figures, layout,
  hasAgenda, hasSpending, hasFigures,
  agendaFailed, spendingFailed, figuresFailed,
}) {
  const history = useHistory();

  // The State language gives this a narrow column of its own; the Ledger
  // gives it the width of the page, where one stacked column would leave
  // every row stretched across a metre of screen.
  return (
    <div className={layout === 'wide' ? `${styles.live} ${styles.wide}` : styles.live}>
      <Block title="Coming into force" caption="From the chain’s own agenda">
        {scheduled.length ? (
          <ul className={styles.rows} data-testid="republic-agenda">
            {scheduled.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  className={styles.row}
                  onClick={() => history.push(router.voting.referendum)}
                >
                  <span className={styles.rowMain}>{item.title}</span>
                  <span className={styles.rowMeta}>
                    {item.when ? `in ${item.when}` : 'next block'}
                    <span className={styles.dim}>{` · block #${item.block.toLocaleString()}`}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.quiet}>
            {waiting(hasAgenda, agendaFailed, 'Nothing is scheduled to execute.', 'the agenda')}
          </p>
        )}
      </Block>

      <Block title="Where the money went" caption="Congress treasury">
        {payments.length ? (
          <ul className={styles.rows} data-testid="republic-spending">
            {payments.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  className={styles.row}
                  onClick={() => history.push(router.congress.wallet)}
                >
                  <span className={styles.rowMain}>
                    {item.amount || (item.usd && `$${item.usd}`) || 'Payment'}
                    {item.what && <span className={styles.dim}>{` — ${item.what}`}</span>}
                  </span>
                  <span className={styles.rowMeta}>
                    {item.date ? format(item.date, 'd MMM yyyy') : ''}
                    {item.amount && item.usd && <span className={styles.dim}>{` · $${item.usd}`}</span>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.quiet}>
            {waiting(hasSpending, spendingFailed, 'No spending has been recorded.', 'the treasury record')}
          </p>
        )}
      </Block>

      <Block title="The republic in figures" caption="Last week">
        {figures.length ? (
          <dl className={styles.figures} data-testid="republic-figures">
            {figures.map((figure) => (
              <div key={figure.key} className={styles.figure}>
                <dt className={styles.figureLabel}>{figure.label}</dt>
                <dd className={styles.figureValue}>{figure.value}</dd>
                <dd className={styles.figureNote}>{figure.note}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className={styles.quiet}>
            {waiting(hasFigures, figuresFailed, 'No figures were reported.', 'the statistics')}
          </p>
        )}
      </Block>
    </div>
  );
}

RepublicLive.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  scheduled: PropTypes.array,
  // eslint-disable-next-line react/forbid-prop-types
  payments: PropTypes.array,
  // eslint-disable-next-line react/forbid-prop-types
  figures: PropTypes.array,
  hasAgenda: PropTypes.bool,
  hasSpending: PropTypes.bool,
  hasFigures: PropTypes.bool,
  agendaFailed: PropTypes.bool,
  spendingFailed: PropTypes.bool,
  figuresFailed: PropTypes.bool,
  layout: PropTypes.oneOf(['column', 'wide']),
};

RepublicLive.defaultProps = {
  layout: 'column',
  scheduled: [],
  payments: [],
  figures: [],
};

export default RepublicLive;
