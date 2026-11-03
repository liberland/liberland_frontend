import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spin from 'antd/es/spin';
import { blockchainSelectors, validatorSelectors, walletSelectors } from '../../../redux/selectors';
import { validatorActions } from '../../../redux/actions';
import { formatDollars } from '../../../utils/walletHelpers';
import { blockTimeFormatted, stakingInfoToProgress } from '../../../utils/staking';
import {
  StakeLLDModal,
  StakingRewardsDestinationModal,
  UnbondModal,
} from '../../Modals';
import WithdrawUnbondedButton from '../StakeManagement/WithdrawUnbondedButton';
import PayoutRewards from '../StakeManagement/PayoutRewards';
import Unbonding from '../StakeManagement/Unbonding';
import StatStrip from '../../StateUI/StatStrip';

/*
 * Stake management, as the Liberland State design language draws it: one
 * statement strip of figures rather than four cards.
 *
 * The selectors, the effects and the action components are the same ones the
 * Ledger screen uses — this only rearranges them.
 */
export default function StateStakeManagement() {
  const balances = useSelector(walletSelectors.selectorBalances);
  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const info = useSelector(validatorSelectors.info);
  const pendingRewards = useSelector(validatorSelectors.pendingRewards);
  const payee = useSelector(validatorSelectors.payee);
  const { stakingInfo, sessionProgress } = useSelector(validatorSelectors.stakingData);
  const dispatch = useDispatch();
  const stakingData = stakingInfoToProgress(stakingInfo, sessionProgress) ?? [];
  const { unlock, blocks } = stakingData?.[0] || {};

  useEffect(() => {
    if (info?.unlocking?.length) {
      dispatch(validatorActions.getStakingData.call());
    }
  }, [dispatch, blockNumber, info]);

  useEffect(() => {
    dispatch(validatorActions.getPayee.call());
  }, [dispatch]);

  if (!balances) {
    return <Spin />;
  }

  const rewardsDescription = (() => {
    switch (payee?.toString()) {
      case 'Staked':
        return 'Paid to your stake automatically';
      case 'Stash':
        return 'Paid into your account';
      default:
        return 'No destination set';
    }
  })();

  return (
    <StatStrip
      stats={[
        {
          key: 'bonded',
          label: 'Bonded',
          value: formatDollars(balances.polkastake.amount),
          unit: 'LLD',
          note: 'Staked with validators',
          action: (
            <>
              <StakeLLDModal label="Stake LLD" />
              <UnbondModal />
            </>
          ),
        },
        {
          key: 'rewards',
          label: 'Rewards pending',
          value: formatDollars(pendingRewards ?? 0),
          unit: 'LLD',
          note: rewardsDescription,
          action: <PayoutRewards />,
        },
        {
          key: 'unbonding',
          label: 'Unbonding',
          value: formatDollars(stakingInfo?.redeemable || '0'),
          unit: 'LLD',
          note: unlock?.value && blocks
            ? `${formatDollars(unlock.value)} unlocks in ${blockTimeFormatted(blocks)}`
            : 'Available to withdraw',
          action: (
            <>
              {stakingData?.length > 1 ? <Unbonding info={info} /> : null}
              <WithdrawUnbondedButton />
            </>
          ),
        },
        {
          key: 'destination',
          label: 'Rewards destination',
          value: payee?.toString() || 'None',
          note: rewardsDescription,
          action: <StakingRewardsDestinationModal />,
        },
      ]}
    />
  );
}
