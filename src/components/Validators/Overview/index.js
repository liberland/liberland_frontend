import React from 'react';
import Slashes from './Slashes';
import PendingRewards from './PendingRewards';
import Status from '../Status';
import SetSessionKeysButton from '../SetSessionKeysButton';
import RewardsConfig from '../RewardsConfig';
import NominatorsList from '../NominatorsList';
import Stats from '../Stats';
import StartStopButton from '../StartStopButton';
import CreateValidatorButton from '../CreateValidatorButton';

export default function Overview() {
  return (
    <div>
      <CreateValidatorButton />
      <Status />
      <Slashes />
      <SetSessionKeysButton />
      <StartStopButton />
      <PendingRewards />
      <RewardsConfig />
      <NominatorsList />
      <Stats />
    </div>
  );
}
