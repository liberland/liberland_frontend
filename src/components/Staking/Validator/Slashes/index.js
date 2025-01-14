import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from 'antd/es/card';
import { validatorSelectors } from '../../../../redux/selectors';
import { validatorActions } from '../../../../redux/actions';
import slashesIcon from '../../../../assets/icons/slashes.svg';
import SlashTable from '../SlashTable';

export default function Slashes() {
  const dispatch = useDispatch();
  const appliedSlashes = useSelector(validatorSelectors.appliedSlashes);
  const unappliedSlashes = useSelector(validatorSelectors.unappliedSlashes);

  useEffect(() => {
    dispatch(validatorActions.getSlashes.call());
  }, [dispatch]);

  if (!appliedSlashes?.length && !unappliedSlashes?.length) {
    return null;
  }

  return (
    <Card
      title="Slashes"
      cover={(
        <img
          src={slashesIcon}
          width="16"
          alt="slash icon"
        />
      )}
    >
      {appliedSlashes?.length > 0 && (
        <SlashTable title="Applied slashes" slashes={appliedSlashes} />
      )}
      {unappliedSlashes?.length > 0 && (
        <SlashTable title="Unapplied slashes" slashes={unappliedSlashes} />
      )}
    </Card>
  );
}
