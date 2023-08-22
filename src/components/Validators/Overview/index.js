import React from 'react';
import Slashes from './Slashes';
import PendingRewards from './PendingRewards';
import Status from '../Status';
import SetSessionKeysButton from '../SetSessionKeysButton';
import RewardsConfig from '../RewardsConfig';
import NominatorsList from '../NominatorsList';

export default function Overview() {
  return (
    <div>
      <Status />
      <Slashes />
      <SetSessionKeysButton />
      <PendingRewards />
      <RewardsConfig />
      <NominatorsList />
    </div>
  );
}
