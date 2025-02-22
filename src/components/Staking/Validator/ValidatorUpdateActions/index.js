import React from 'react';
import Flex from 'antd/es/flex';
import { useDispatch } from 'react-redux';
import SetSessionKeysModalWrapper from '../../../Modals/SetSessionKeysModal';
import StartStopButton from '../StartStopButton';
import Button from '../../../Button/Button';
import { validatorActions } from '../../../../redux/actions';

function ValidatorUpdateActions() {
  const dispatch = useDispatch();
  const onSubmit = ({ keys }) => {
    dispatch(validatorActions.setSessionKeys.call({ keys }));
  };
  const chill = () => {
    dispatch(validatorActions.chill.call());
  };
  return (
    <Flex wrap gap="15px" justify="end">
      <SetSessionKeysModalWrapper onSubmit={onSubmit} />
      <StartStopButton />
      <Button primary onClick={chill}>
        Switch to Nominator
      </Button>
    </Flex>
  );
}

export default ValidatorUpdateActions;
