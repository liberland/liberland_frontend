import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Spin from 'antd/es/spin';
import Collapse from 'antd/es/collapse';
import Result from 'antd/es/result';
import Title from 'antd/es/typography/Title';
import Flex from 'antd/es/flex';
import { useParams } from 'react-router-dom';
import { Proposal } from '../../../../Proposal';
import { blockchainSelectors } from '../../../../../redux/selectors';
import { getPreImage } from '../../../../../api/nodeRpcCall';
import useDemocracyInfo from '../useDemocracyInfo';
import MissingItem from '../MissingItem';
import { findDispatch } from './utils';

/*
 * One scheduled call.
 *
 * Two things were wrong here, and either alone made this address unusable.
 * It read `item.blockNumber` before checking that the agenda had arrived, so
 * opening the page at all took the screen down. And it matched the route
 * parameter against the numeric index with `===`, so even with the agenda in
 * hand nothing ever matched. The matching now lives in utils, where it can
 * be tested on its own.
 */
function DispatchPage() {
  const { dispatchId } = useParams();
  const { info, hasLoaded } = useDemocracyInfo();
  const currentBlockNumber = useSelector(blockchainSelectors.blockNumber);

  const item = findDispatch(info?.scheduledCalls, dispatchId);

  const hash = (item?.call?.call?.isLookup && item?.call?.call?.asLookup?.hash_)
    || item?.proposal?.hash;
  const proposal = item?.proposal || item?.preimage;
  const needCallPreImage = !!item?.needCallPreImage;

  const [preimage, setPreimageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    (async () => {
      if (!hash || !item?.call?.call?.asLookup?.len) {
        return;
      }
      try {
        setIsError(false);
        setIsLoading(true);
        const preimageData = await getPreImage(hash, item?.call?.call?.asLookup?.len);
        setPreimageData(preimageData);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [hash, item?.call?.call?.asLookup?.len]);

  if (!hasLoaded || isLoading) {
    return <Spin />;
  }

  if (!item) {
    return <MissingItem kind="dispatch" id={dispatchId} />;
  }

  const blockNumber = item.blockNumber?.toNumber?.() ?? Number(item.blockNumber);
  const blocksRemaining = blockNumber - currentBlockNumber;
  const daysRemaining = ((blocksRemaining * 6) / 3600 / 24).toFixed(2);

  return (
    <Flex vertical gap="20px">
      <Title level={1}>
        Dispatch
        {' #'}
        {item.idx}
      </Title>
      <Collapse
        defaultActiveKey={['details']}
        items={[{
          key: 'details',
          extra: (
            <div>
              Implements in:
              {' '}
              {`${daysRemaining} days`}
            </div>
          ),
          children: (
            <>
              {isError && <Result status="error" title="Could not display dispatch" />}
              {needCallPreImage && preimage && <Proposal proposal={preimage} />}
              {!needCallPreImage && <Proposal proposal={proposal} />}
            </>
          ),
        }]}
      />
    </Flex>
  );
}

export default DispatchPage;
