import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { validatorSelectors, walletSelectors } from '../../../redux/selectors';
import { formatDollars } from '../../../utils/walletHelpers';
import Button from '../../Button/Button';
import { StakeLLDModal, UnbondModal } from '../../Modals';
import StakingMode from './StakingMode';
import RewardsConfig from './RewardsConfig';
import styles from './styles.module.scss';
import PendingRewardsData from './PendingRewardsData';
import RewardsConfigButton from './RewardsConfig/RewardsConfigButton';
import WithdrawUnbondedButton from './WithdrawUnbondedButton';
import PayoutRewards from './PayoutRewards';
import Unbonding from './Unbonding';

function CurrentlyStaked() {
  const balances = useSelector(walletSelectors.selectorBalances);
  return (
    <div className={styles.rowWrapper}>
      <span>Currently staked: </span>
      <span>
        <b>
          {formatDollars(balances.polkastake.amount)}
          {' '}
          LLD
        </b>
      </span>
    </div>
  );
}

export default function StakeManagement() {
  const balances = useSelector(walletSelectors.selectorBalances);
  const info = useSelector(validatorSelectors.info);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [isUnbondModalOpen, setIsUnbondModalOpen] = useState(false);

  if (!balances) return null;

  const handleStakeModalOpen = () => setIsStakeModalOpen(!isStakeModalOpen);
  const handleUnbondModalOpen = () => setIsUnbondModalOpen(!isUnbondModalOpen);

  return (
    <div className={styles.stakingWrapper}>
      <div className={styles.flex}>
        <div className={styles.stakingInfoWrapper}>
          <h3>LLD staking</h3>
          <div className={styles.internalWrapper}>
            <CurrentlyStaked />
            {info?.stash && (
              <>
                <PendingRewardsData />
                <RewardsConfig />
                <Unbonding />
                <div className={styles.stakingActionButtonsWrapper}>
                  <Button small primary onClick={handleStakeModalOpen}>
                    Add stake
                  </Button>
                  <WithdrawUnbondedButton />
                  <Button small secondary onClick={handleUnbondModalOpen}>
                    Unstake
                  </Button>
                  <RewardsConfigButton />
                  <PayoutRewards />
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.stakingModeWrapper}>
          <div>
            <h3>Staking mode</h3>
            <div className={styles.internalWrapper}>
              <StakingMode />
            </div>
          </div>
        </div>
      </div>
      {isStakeModalOpen && <StakeLLDModal closeModal={handleStakeModalOpen} />}
      {isUnbondModalOpen && <UnbondModal closeModal={handleUnbondModalOpen} />}
    </div>
  );
}
