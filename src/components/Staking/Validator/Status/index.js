import React from 'react';
import { useSelector } from 'react-redux';
import { validatorSelectors } from '../../../../redux/selectors';

export default function Status() {
  const info = useSelector(validatorSelectors.info);

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
