import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { validatorSelectors, walletSelectors } from '../../../redux/selectors';
import { formatDollars } from '../../../utils/walletHelpers';
import Button from '../../Button/Button';
import { StakeLLDModal } from '../../Modals';
import StakingMode from './StakingMode';
import RewardsConfig from './RewardsConfig';
import styles from './styles.module.scss';
import PendingRewardsData from './PendingRewardsData';
import RewardsConfigButton from './RewardsConfig/RewardsConfigButton';
import PayoutRewards from './PayoutRewards';

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

  if (!balances) return null;

  const handleStakeModalOpen = () => setIsStakeModalOpen(!isStakeModalOpen);

  return (
    <div className={styles.stakingWrapper}>
      <div className={styles.flex}>
        <div>
          <h3>LLD staking</h3>
          <div className={styles.internalWrapper}>
            <CurrentlyStaked />
            {info?.stash && (
              <>
                <PendingRewardsData />
                <RewardsConfig />
              </>
            )}
            {info?.stash && (
              <div className={styles.rowEnd}>
                <Button small primary onClick={handleStakeModalOpen}>
                  Add stake
                </Button>
                <RewardsConfigButton />
                <PayoutRewards />
              </div>
            )}
          </div>
        </div>
        <div>
          <div>
            <h3>Staking mode</h3>
            <div className={styles.internalWrapper}>
              <StakingMode />
            </div>
          </div>
        </div>
      </div>
      {isStakeModalOpen && <StakeLLDModal closeModal={handleStakeModalOpen} />}
    </div>
  );
}
