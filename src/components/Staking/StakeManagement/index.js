import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
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
import stylesPage from '../../../utils/pagesBase.module.scss';
import Card from '../../Card';

function CurrentlyStaked() {
  const balances = useSelector(walletSelectors.selectorBalances);

  return (
    <div className={cx(styles.rowWrapper, styles.currentlyStaked)}>
      <span>Currently staked: </span>
      <span>
        {formatDollars(balances.polkastake.amount)}
        {' '}
        LLD
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
      <Card className={cx(stylesPage.overviewWrapper, styles.customCard)} title="LLD staking">
        <div>
          <CurrentlyStaked />
          {info?.stash && (
          <>
            <PendingRewardsData />
            <RewardsConfig />
            <Unbonding />
            <div className={styles.stakingActionButtonsWrapper}>
              <Button small primary onClick={handleStakeModalOpen}>
                ADD STAKE
              </Button>
              <WithdrawUnbondedButton />
              <Button small secondary onClick={handleUnbondModalOpen}>
                UNSTAKE
              </Button>
              <RewardsConfigButton />
              <PayoutRewards />
            </div>
          </>
          )}
        </div>
      </Card>
      <Card className={cx(stylesPage.overviewWrapper, styles.customCard, styles.stakingCard)} title="Staking mode">
        <div className={styles.internalWrapper}>
          <StakingMode />
        </div>
      </Card>
      {isStakeModalOpen && <StakeLLDModal closeModal={handleStakeModalOpen} />}
      {isUnbondModalOpen && <UnbondModal closeModal={handleUnbondModalOpen} />}
    </div>
  );
}
