import React from 'react';
import Slashes from './Slashes';
import PendingRewards from './PendingRewards';
import Status from '../Status';

export default function Overview() {
  return (
    <div>
      <Status />
      <Slashes />
      <PendingRewards />
    </div>
  );
}
