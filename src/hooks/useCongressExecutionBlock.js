import { useSelector } from 'react-redux';
import { blockchainSelectors } from '../redux/selectors';

export default function useCongressExecutionBlock(votingDays) {
  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const blocksInDay = (3600 * 24) / 6;
  const votingBlocks = parseInt(votingDays) * blocksInDay;

  // minimum time between scheduling and executing call
  // eslint-disable-next-line max-len
  // see https://github.com/liberland/liberland_substrate/blob/30cd04f84c9a0b17393d1015f38e935b510f5448/substrate/bin/node/runtime/src/impls.rs#L279-L282
  const minSchedulerDelay = 4 * blocksInDay;

  const executionBlock = blockNumber // now
        + votingBlocks // time it will take congress to finish voting
        + blocksInDay // additional one day for delay in closing
        + minSchedulerDelay;

  return executionBlock;
}
