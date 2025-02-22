import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { blockchainActions } from '../../../redux/actions';
import { blockchainSelectors } from '../../../redux/selectors';
import { decodeCall } from '../../../api/nodeRpcCall';

function Preimage({
  hash,
  len,
  isDetailsHidden,
  children,
}) {
  const dispatch = useDispatch();
  const [call, setCall] = useState(null);
  const preimages = useSelector(blockchainSelectors.preimages);
  const preimage = preimages[hash.toString()];

  useEffect(() => {
    if (!preimage) {
      dispatch(blockchainActions.fetchPreimage.call({
        hash,
        len,
      }));
    }
  }, [dispatch, preimage, hash, len]);

  useEffect(() => {
    (async () => {
      if (preimage && preimage.isSome && !call) {
        setCall(await decodeCall(preimage.unwrap()));
      }
    })();
  }, [preimage, call, setCall]);

  if (preimage === undefined) {
    return <div>Loading details...</div>;
  }
  if (preimage.isNone) {
    return (
      <div>
        Details not provided on-chain. Hash:
        {hash.toString()}
      </div>
    );
  }
  if (call === null) {
    return <div>Loading details...</div>;
  }

  return (
    <>{children(call, isDetailsHidden)}</>
  );
}

Preimage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  hash: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  len: PropTypes.object.isRequired,
  isDetailsHidden: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired,
};

export default Preimage;
