import React from 'react';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import Slashes from './Slashes';
import Status from './Status';
import NominatorsList from './NominatorsList';
import Stats from './Stats';
import StartStopButton from './StartStopButton';
import CreateValidatorButton from './CreateValidatorButton';
import SetSessionKeysModalWrapper from '../../Modals/SetSessionKeysModal';
import styles from './styles.module.scss';

export default function Overview() {
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
          <SetSessionKeysModalWrapper />
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
