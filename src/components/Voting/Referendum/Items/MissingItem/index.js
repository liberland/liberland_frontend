import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Button from '../../../../Button/Button';
import EmptyState from '../../../../EmptyState';
import router from '../../../../../router';

/*
 * What a single-item page says when the chain has answered and the item is
 * not in that answer: a link someone kept after the thing it pointed at was
 * decided, or a number that was never right.
 *
 * Said plainly, because what a reader met otherwise was a spinner that never
 * stopped — or, before this, the error screen. It borrows EmptyState rather
 * than antd's 404 Result for the same reason EmptyState exists: that
 * illustration is a saturated cartoon that belongs to neither design
 * language.
 */
function MissingItem({ kind, id }) {
  const history = useHistory();

  return (
    <EmptyState
      title={`This ${kind} is not open`}
      description={id
        ? `Nothing open matches ${kind} ${id}. It may have been decided and cleared since this link was made.`
        : `Nothing open matches this ${kind}. It may have been decided and cleared since this link was made.`}
      action={(
        <Button primary onClick={() => history.push(router.voting.referendum)}>
          All open votes
        </Button>
      )}
    />
  );
}

MissingItem.propTypes = {
  kind: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export default MissingItem;
