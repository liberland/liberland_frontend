import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import { Proposal } from '../../../../Proposal';
import { blockchainSelectors } from '../../../../../redux/selectors';
import Button from '../../../../Button/Button';
import { getPreImage } from '../../../../../api/nodeRpcCall';

function DispatchItem({
  item,
}) {
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

  const onClick = async () => {
    if (isLoading || !hash || !item?.call?.call?.asLookup?.len) return;
    try {
      setIsError(false);
      setIsLoading(true);
      const preimageData = await getPreImage(hash, item?.call?.call?.asLookup?.len);
      setPreimageData(preimageData);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      extra={hash.toHex()}
      actions={[
        <Button primary onClick={onClick} disabled={isLoading}>
          {isLoading && 'Loading...'}
          {isError && 'Error, try again'}
          {(!isLoading && !isError) && 'Get Details'}
        </Button>,
      ]}
    >
      <Card.Meta
        title={`#${item.blockNumber.toNumber()}/${item.idx}`}
        description={(
          <Flex wrap gap="15px">
            <div>
              Implements in:
              {' '}
              {timeLeftUntilImplemented}
            </div>
            <div>
              Details:
              {needCallPreImage && preimage && <Proposal proposal={preimage} />}
              {!needCallPreImage && <Proposal proposal={proposal} />}
            </div>
          </Flex>
        )}
      />
    </Card>
  );
}

/* eslint-disable react/forbid-prop-types */
DispatchItem.propTypes = {
  item: PropTypes.shape({
    blockNumber: PropTypes.object.isRequired,
    idx: PropTypes.number.isRequired,
    preimage: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.oneOf([null]),
    ]),
    needCallPreImage: PropTypes.bool,
    proposal: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.oneOf([null]),
    ]),
    call: PropTypes.shape({
      call: PropTypes.shape({
        asLookup: PropTypes.shape({
          hash_: PropTypes.object.isRequired,
          len: PropTypes.object.isRequired,
        }),
        isLookup: PropTypes.bool.isRequired,
      }),
    }),
  }).isRequired,
};

export default DispatchItem;
