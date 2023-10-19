import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss';
import Card from '../../../../Card';
import { Proposal } from '../../../../Proposal';
import { blockchainSelectors } from '../../../../../redux/selectors';

function DispatchItem({
  item,
}) {
  const currentBlockNumber = useSelector(blockchainSelectors.blockNumber);

  const hash = item.call.call.asLookup.hash_;
  const blocksRemaining = item.blockNumber.toNumber() - currentBlockNumber;
  const daysRemaining = ((blocksRemaining * 6) / 3600 / 24).toFixed(2);
  const timeLeftUntilImplemented = `${daysRemaining} days`;

  return (
    <Card
      title={`#${item.blockNumber.toNumber()}/${item.idx}`}
      className={styles.referendumItemContainer}
    >
      <div>
        <div className={styles.metaInfoLine}>
          <div>
            <div className={styles.hashText}>
              {hash.toHex()}
            </div>
          </div>
        </div>
        <div className={styles.discussionMetaLine}>
          <div>
            <span className={styles.votingTimeText}>Implements in:</span>
            {' '}
            <b>{timeLeftUntilImplemented}</b>
          </div>
        </div>
        <div>
          Details:
          <Proposal proposal={item.preimage} />
        </div>
      </div>
    </Card>
  );
}

/* eslint-disable react/forbid-prop-types */
DispatchItem.propTypes = {
  item: PropTypes.shape({
    blockNumber: PropTypes.object.isRequired,
    idx: PropTypes.number.isRequired,
    preimage: PropTypes.object.isRequired,
    call: PropTypes.shape({
      call: PropTypes.shape({
        asLookup: PropTypes.shape({
          hash_: PropTypes.object.isRequired,
        }),
      }),
    }),
  }).isRequired,
};

export default DispatchItem;
