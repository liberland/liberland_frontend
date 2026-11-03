import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { deadlineText, isClosingSoon } from '../../utils/pendingTasks';
import styles from './styles.module.scss';

/*
 * The list of what is waiting on this citizen.
 *
 * Written in design tokens only, so the one implementation reads correctly in
 * both the Ledger and the State language — the same reasoning as the motions
 * board. The heading and the surrounding frame belong to whichever screen is
 * hosting it, because the two languages open a block very differently.
 *
 * An empty list is stated plainly rather than hidden: "nothing is waiting on
 * you" is information a person came here for, and a panel that vanishes when
 * empty leaves them unsure whether it ran at all.
 */

function TaskRow({ task, onOpen }) {
  const when = deadlineText(task);
  const soon = isClosingSoon(task);

  return (
    <div
      className={styles.task}
      role="link"
      tabIndex={0}
      aria-label={`${task.kind}: ${task.title}`}
      data-testid={`pending-task-${task.key}`}
      onClick={() => onOpen(task.route)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(task.route);
        }
      }}
    >
      <div className={styles.head}>
        <span className={styles.kind}>{task.kind}</span>
        <span className={styles.context}>{task.context}</span>
        {when && (
          <span className={soon ? `${styles.when} ${styles.whenSoon}` : styles.when}>
            {when}
          </span>
        )}
      </div>
      <h3 className={styles.title}>{task.title}</h3>
      {task.detail && <p className={styles.detail}>{task.detail}</p>}
    </div>
  );
}

TaskRow.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  task: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
};

function PendingTasks({
  tasks, isLoading, isSignedIn, limit,
}) {
  const history = useHistory();
  const open = (route) => history.push(route);

  if (!isSignedIn) {
    return (
      <p className={styles.quiet}>
        Connect a wallet to see what is waiting for your vote or signature.
      </p>
    );
  }

  if (isLoading && !tasks.length) {
    return <p className={styles.quiet} data-testid="pending-tasks-loading">Checking the chain…</p>;
  }

  if (!tasks.length) {
    return (
      <p className={styles.quiet} data-testid="pending-tasks-empty">
        Nothing is waiting on you. Every vote, closure and signature you owe is done.
      </p>
    );
  }

  const shown = limit ? tasks.slice(0, limit) : tasks;
  const hidden = tasks.length - shown.length;

  return (
    <div className={styles.list} data-testid="pending-tasks">
      {shown.map((task) => (
        <TaskRow key={task.key} task={task} onOpen={open} />
      ))}
      {hidden > 0 && (
        <p className={styles.more}>
          {`and ${hidden} more`}
        </p>
      )}
    </div>
  );
}

PendingTasks.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  tasks: PropTypes.array,
  isLoading: PropTypes.bool,
  isSignedIn: PropTypes.bool,
  limit: PropTypes.number,
};

PendingTasks.defaultProps = {
  tasks: [],
};

export default PendingTasks;
