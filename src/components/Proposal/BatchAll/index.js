import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  isFastTrackProposal,
  isTransfer,
  isRemark,
  getTransferHook,
} from '../utils';
import FastTrackedReferendum from '../FastTrackedReferendum';
import styles from '../styles.module.scss';
import TransferWithRemark from '../TransferWithRemark';

function BatchAll({
  proposal,
  children,
  batchId,
  id,
  isTableRow,
}) {
  const { args: [calls] } = proposal;
  const { rows, remarkRowParts, transferRowParts } = useMemo(() => {
    if (!isTableRow) {
      return { rows: calls };
    }
    const transfers = calls.filter(isTransfer);
    const remarks = calls.filter(isRemark);
    const rest = calls.filter((p) => !isTransfer(p) && !isRemark(p));
    return { transferRowParts: transfers, remarkRowParts: remarks, rows: rest };
  }, [isTableRow, calls]);

  if (isFastTrackProposal(proposal)) {
    return (
      <FastTrackedReferendum proposal={calls[0]} fastTrack={calls[1]}>
        {children}
      </FastTrackedReferendum>
    );
  }

  return (
    <>
      {transferRowParts?.length && remarkRowParts?.length ? (
        transferRowParts.map((transfer, i) => (
          <TransferWithRemark
            id={id + i}
            remark={remarkRowParts[i]}
            transfer={transfer}
            useTransfer={getTransferHook(transfer)}
          />
        ))
      ) : null}
      {rows?.length ? (
        <div>
          List of proposals found in batch
          {' '}
          {batchId}
          :
          <ul>
            {rows.map((call, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <li className={styles.batchItem} key={`proposal ${idx}`}>
                {children(call)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

BatchAll.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
  batchId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isTableRow: PropTypes.bool,
};

export default BatchAll;
