import React from 'react';
import PropTypes from 'prop-types';
import { isFastTrackProposal, isTransferWithRemark, getTransferHook } from '../utils';
import FastTrackedReferendum from '../FastTrackedReferendum';
import styles from '../styles.module.scss';
import TransferWithRemark from '../TransferWithRemark';

function BatchAll({
  proposal,
  children,
  batchId,
  id,
}) {
  const { args: [calls] } = proposal;
  if (isFastTrackProposal(proposal)) {
    return (
      <FastTrackedReferendum proposal={calls[0]} fastTrack={calls[1]}>
        {children}
      </FastTrackedReferendum>
    );
  }
  return (
    <div>
      List of proposals found in batch
      {' '}
      {batchId}
      :
      <ul>
        {isTransferWithRemark(proposal) ? (
          <TransferWithRemark
            id={id}
            remark={calls[1]}
            transfer={calls[0]}
            useTransfer={getTransferHook(calls[0])}
            key={id}
          />
        ) : calls.map((call, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <li className={styles.batchItem} key={`proposal ${idx}`}>
            {children(call)}
          </li>
        ))}
      </ul>
    </div>
  );
}

BatchAll.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
  batchId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default BatchAll;
