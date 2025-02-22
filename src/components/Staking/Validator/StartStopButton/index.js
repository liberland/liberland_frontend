import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { validatorSelectors } from '../../../../redux/selectors';
import { validatorActions } from '../../../../redux/actions';
import Button from '../../../Button/Button';
import StartValidatorModal from '../../../Modals/StartValidatorModal';

function StopButton({ typeText }) {
  const dispatch = useDispatch();

  const stop = () => {
    dispatch(validatorActions.chill.call());
  };

  return (
    <Button red onClick={stop}>
      Stop
      {' '}
      {typeText}
    </Button>
  );
}

StopButton.propTypes = {
  typeText: PropTypes.node.isRequired,
};

export default function StartStopButton() {
  const info = useSelector(validatorSelectors.info); // something else must call getInfo action

  if (!info.stash) {
    return null;
  }

  if (info.isStakingValidator) {
    return <StopButton typeText="Validating" />;
  }

  if (info.isNominator) {
    return <StopButton typeText="Nominating" />;
  }

  return <StartValidatorModal label="Start validating" />;
}
