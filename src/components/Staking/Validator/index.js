import React from 'react';
import Slashes from './Slashes';
import Status from './Status';
import SetSessionKeysButton from './SetSessionKeysButton';
import NominatorsList from './NominatorsList';
import Stats from './Stats';
import StartStopButton from './StartStopButton';
import CreateValidatorButton from './CreateValidatorButton';

export default function Overview() {
  return (
    <div>
      <CreateValidatorButton />
      <Status />
      <Slashes />
      <SetSessionKeysButton />
      <StartStopButton />
      <NominatorsList />
      <Stats />
    </div>
  );
}
