import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Progress from 'antd/es/progress';
import { BN, BN_ZERO } from '@polkadot/util';
import { blockchainSelectors } from '../../../redux/selectors';

export default function NextBlockCountdown() {
  const currentBlockTimestamp = useSelector(blockchainSelectors.blockTimestamp);
  const blockDurationMilis = 6000;
  const [nextBlockCounter, setNextBlockCounter] = useState(
    blockDurationMilis - (Date.now() - currentBlockTimestamp),
  );

  useEffect(() => {
    const diff = Date.now() - currentBlockTimestamp;
    if (diff <= 50) setNextBlockCounter(blockDurationMilis - diff);
    const timer = nextBlockCounter > 0
      && setInterval(() => setNextBlockCounter(nextBlockCounter - 100), 100);
    return () => clearInterval(timer);
  }, [nextBlockCounter, currentBlockTimestamp]);

  const progress = new BN((Math.trunc(nextBlockCounter / 100) / 60) * 100);
  const progressBarRatio = new BN(progress).gt(BN_ZERO)
    ? (100 - parseInt(progress.toString()))
    : 0;

  return (
    <Progress
      type="circle"
      percent={progressBarRatio}
    />
  );
}
