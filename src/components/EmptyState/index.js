import React from 'react';
import PropTypes from 'prop-types';
import Empty from 'antd/es/empty';
import styles from './styles.module.scss';

/**
 * Empty state for a collection that is genuinely empty.
 *
 * Replaces `<Result status="info">`, whose large filled icon reads as an alert
 * and is badly off-palette in dark mode — a saturated blue disc announcing
 * that nothing happened. An empty list is not an error, so it gets quiet
 * treatment and, where one exists, the action that would fill it.
 */
function EmptyState({ title, description, action }) {
  return (
    <Empty
      className={styles.empty}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={<span className={styles.title}>{title}</span>}
    >
      {description ? <div className={styles.description}>{description}</div> : null}
      {action}
    </Empty>
  );
}

EmptyState.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  action: PropTypes.node,
};

export default EmptyState;
