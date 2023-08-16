import React from 'react';
import Slashes from './Slashes';
import PendingRewards from './PendingRewards';
import Status from '../Status';
import SetSessionKeysButton from '../SetSessionKeysButton';

export default function Overview() {
  return (
    <div>
      <Status />
      <Slashes />
      <SetSessionKeysButton />
      <PendingRewards />
    </div>
  );
}
