import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss';
import Card from '../../../../Card';
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
      title={`#${item.blockNumber.toNumber()}/${item.idx}`}
      isNotBackground
    >
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
        {needCallPreImage && !preimage
          && (
          <Button primary medium onClick={onClick} disabled={isLoading}>
            {isLoading && 'Loading...'}
            {isError && 'Error, try again'}
            {(!isLoading && !isError) && 'Get Details'}
          </Button>
          )}
        {needCallPreImage && preimage
          && <Proposal proposal={preimage} />}
        {!needCallPreImage && <Proposal proposal={proposal} />}
      </div>
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
