import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { validatorSelectors, walletSelectors } from '../../../redux/selectors';
import { formatDollars } from '../../../utils/walletHelpers';
import Button from '../../Button/Button';
import { StakeLLDModal } from '../../Modals';
import StakingMode from './StakingMode';
import RewardsConfig from './RewardsConfig';
import PendingRewards from './PendingRewards';

export default function StakeManagement() {
  const balances = useSelector(walletSelectors.selectorBalances);
  const info = useSelector(validatorSelectors.info);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);

  if (!balances) return null;

  const handleStakeModalOpen = () => setIsStakeModalOpen(!isStakeModalOpen);

  return (
    <div>
      Currently staked:
      {' '}
      {formatDollars(balances.polkastake.amount)}
      {' '}
      LLD
      { info?.stash && (
      <>
        <Button small primary onClick={handleStakeModalOpen}>Add stake</Button>
        <RewardsConfig />
        <PendingRewards />
      </>
      ) }
      { isStakeModalOpen && <StakeLLDModal closeModal={handleStakeModalOpen} />}
      <StakingMode />
    </div>
  );
}
