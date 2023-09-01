import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validatorSelectors } from '../../redux/selectors';
import { validatorActions } from '../../redux/actions';
import StakeManagement from './StakeManagement';
import Validator from './Validator';
import Nominator from './Nominator';

export default function Staking() {
  const dispatch = useDispatch();
  const info = useSelector(validatorSelectors.info);

  useEffect(() => {
    dispatch(validatorActions.getInfo.call());
  }, [dispatch]);

  if (!info) return null; // loading

  let render = null;
  if (info.isStakingValidator) {
    render = <Validator />;
  } else if (info.stash) {
    render = <Nominator />;
  }

  return (
    <div>
      <StakeManagement />
      {render}
    </div>
  );
}
