import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../Button/Button';

// REDUX
import { congressActions } from '../../../redux/actions';
import {
  congressSelectors,
  blockchainSelectors,
} from '../../../redux/selectors';

export default function Overview() {
  const dispatch = useDispatch();
  const congressCandidates = useSelector(congressSelectors.congressCandidates);
  const sender = useSelector(blockchainSelectors.userWalletAddressSelector);

  useEffect(() => {
    dispatch(congressActions.getCongressCandidates.call());
  }, [dispatch]);

  return (
    <div>
      {!congressCandidates.find((candidate) => candidate[0] === sender) && (
        <Button
          medium
          primary
          onClick={() => dispatch(congressActions.applyForCongress.call())}
        >
          Apply for Congress
        </Button>
      )}
    </div>
  );
}
