import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { validatorSelectors } from '../../../../redux/selectors';

export default function Status() {
  const info = useSelector(validatorSelectors.info);
  const status = useMemo(() => {
    if (info.isSessionValidator) {
      return 'Active';
    }
    if (info.isStakingValidator) {
      return 'Waiting';
    }
    if (info.isNominator) {
      return 'Nominating';
    }
    if (!info.stash) {
      return 'Not created';
    }
    return 'Stopped';
  }, [info]);

  return (
    <strong>
      Status:
      {' '}
      {status}
      {' '}
      {info.isNextSessionValidator && ' - scheduled for next session'}
    </strong>
  );
}
