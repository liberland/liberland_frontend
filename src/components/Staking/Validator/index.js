import React from 'react';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import { useDispatch } from 'react-redux';
import Slashes from './Slashes';
import Status from './Status';
import NominatorsList from './NominatorsList';
import Stats from './Stats';
import StartStopButton from './StartStopButton';
import CreateValidatorButton from './CreateValidatorButton';
import SetSessionKeysModalWrapper from '../../Modals/SetSessionKeysModal';
import styles from './styles.module.scss';
import { validatorActions } from '../../../redux/actions';

export default function Overview() {
  const dispatch = useDispatch();
  const onSubmit = ({ keys }) => {
    dispatch(validatorActions.setSessionKeys.call({ keys }));
  };

  return (
    <Card
      title="Validator status"
      extra={<Status />}
      cover={(
        <Stats />
      )}
      actions={[
        <Flex wrap gap="15px" justify="end" className={styles.actions}>
          <CreateValidatorButton />
          <SetSessionKeysModalWrapper onSubmit={onSubmit} />
          <StartStopButton />
        </Flex>,
      ]}
    >
      <Card.Meta
        description={(
          <NominatorsList />
        )}
      />
      <Slashes />
    </Card>
  );
}
