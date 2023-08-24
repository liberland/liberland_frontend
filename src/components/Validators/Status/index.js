import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validatorSelectors } from '../../../redux/selectors';
import { validatorActions } from '../../../redux/actions';

export default function Status() {
  const dispatch = useDispatch();
  const info = useSelector(validatorSelectors.info);

  useEffect(() => {
    dispatch(validatorActions.getInfo.call());
  }, [dispatch]);

  let status;
  if (info.isSessionValidator) status = 'Active';
  else if (info.isStakingValidator) status = 'Waiting';
  else if (info.isNominator) status = 'Nominating';
  else if (!info.stash) status = 'Not created';
  else status = 'Stopped';

  return (
    <div>
      {status}
      {' '}
      {info.isNextSessionValidator && ' - scheduled for next session'}
    </div>
  );
}
