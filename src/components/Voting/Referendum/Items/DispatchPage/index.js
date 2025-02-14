import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spin from 'antd/es/spin';
import Collapse from 'antd/es/collapse';
import Alert from 'antd/es/alert';
import Title from 'antd/es/typography/Title';
import Flex from 'antd/es/flex';
import { useParams } from 'react-router-dom';
import { Proposal } from '../../../../Proposal';
import { blockchainSelectors, democracySelectors } from '../../../../../redux/selectors';
import { getPreImage } from '../../../../../api/nodeRpcCall';
import { democracyActions } from '../../../../../redux/actions';

function DispatchPage() {
  const democracy = useSelector(democracySelectors.selectorDemocracyInfo);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(democracyActions.getDemocracy.call(userWalletAddress));
  }, [dispatch, userWalletAddress]);
  const { dispatchId } = useParams();
  const item = democracy.democracy?.scheduledCalls?.find(({
    idx,
  }) => idx === dispatchId);
  const currentBlockNumber = useSelector(blockchainSelectors.blockNumber);
  const hash = (item?.call?.call?.isLookup && item?.call?.call?.asLookup?.hash_)
  || item?.proposal?.hash;
  const proposal = item?.proposal || item?.preimage;
  const needCallPreImage = !!item?.needCallPreImage;

  const blocksRemaining = item.blockNumber.toNumber() - currentBlockNumber;
  const daysRemaining = ((blocksRemaining * 6) / 3600 / 24).toFixed(2);
  const timeLeftUntilImplemented = `${daysRemaining} days`;
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

  if (isLoading) {
    return <Spin />;
  }

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
              {timeLeftUntilImplemented}
            </div>
          ),
          children: (
            <>
              {isError && <Alert type="error" message="Could not display dispatch" />}
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
