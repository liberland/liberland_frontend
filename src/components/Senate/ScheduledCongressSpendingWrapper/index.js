import React from 'react';
import { MotionProvider } from '../../WalletCongresSenate/ContextMotions';
import ScheduledCongressSpending from '../ScheduledCongressSpending';

function ScheduledCongressSpendingWrapper() {
  return (
    <MotionProvider>
      <ScheduledCongressSpending isVetoButton />
    </MotionProvider>
  );
}

export default ScheduledCongressSpendingWrapper;
