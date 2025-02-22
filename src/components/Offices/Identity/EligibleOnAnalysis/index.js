import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Space from 'antd/es/space';
import PropTypes from 'prop-types';
import { ReactComponent as CancelIcon } from '../../../../assets/icons/cancel.svg';
import { blockchainSelectors } from '../../../../redux/selectors';

function parseEligibleOn(eligible_on) {
  const bytes = eligible_on.asRaw; // little-endian
  bytes.reverse(); // big-endian
  const hex = Buffer.from(bytes).toString('hex');
  return parseInt(hex, 16);
}

function EligibleOnAnalysis({ identity }) {
  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const [now] = useState(new Date());

  const [, eligible_on] = identity.info.additional.find(([key, _]) => key.eq('eligible_on')) || [];
  if (!eligible_on) {
    return (
      <div>
        Missing
        <Space />
        <CancelIcon />
      </div>
    );
  }
  if (!eligible_on.isRaw) {
    return (
      <div>
        Invalid
        <Space />
        <CancelIcon />
      </div>
    );
  }

  EligibleOnAnalysis.propTypes = {
    identity: PropTypes.instanceOf(Map).isRequired,
  };

  const eligibleOnBlockNumber = parseEligibleOn(eligible_on);
  const msFromNow = (eligibleOnBlockNumber - blockNumber) * 6 * 1000;
  const eligibleOnDate = new Date(now.getTime() + msFromNow);

  return (
    <div>
      Candidate claims that they&apos;re 15 or older on date:
      <br />
      {eligibleOnDate.toString()}
    </div>
  );
}

export default EligibleOnAnalysis;
