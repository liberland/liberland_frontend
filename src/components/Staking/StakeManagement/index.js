import React from 'react';
import { useSelector } from 'react-redux';
import Collapse from 'antd/es/collapse';
import Flex from 'antd/es/flex';
import { validatorSelectors, walletSelectors } from '../../../redux/selectors';
import { formatDollars } from '../../../utils/walletHelpers';
import { StakeLLDModal, StakingRewardsDestinationModal, UnbondModal } from '../../Modals';
import StakingMode from './StakingMode';
import RewardsConfig from './RewardsConfig';
import PendingRewardsData from './PendingRewardsData';
import WithdrawUnbondedButton from './WithdrawUnbondedButton';
import PayoutRewards from './PayoutRewards';
import Unbonding from './Unbonding';

export default function StakeManagement() {
  const balances = useSelector(walletSelectors.selectorBalances);
  const info = useSelector(validatorSelectors.info);

  if (!balances) {
    return null;
  }

  return (
    <Collapse
      defaultActiveKey={['staking', 'mode']}
      items={[
        {
          key: 'staking',
          label: 'LLD staking',
          extra: (
            <>
              <div className="description">
                Currently staked:
              </div>
              <div className="value">
                {formatDollars(balances.polkastake.amount)}
                {' '}
                LLD
              </div>
            </>
          ),
          children: info?.stash ? (
            <>
              <PendingRewardsData />
              <RewardsConfig />
              <Unbonding {...{ info }} />
              <Flex wrap gap="15px">
                <StakeLLDModal label="Add stake" />
                <WithdrawUnbondedButton />
                <UnbondModal />
                <StakingRewardsDestinationModal />
                <PayoutRewards />
              </Flex>
            </>
          ) : null,
        },
        {
          key: 'mode',
          label: 'Staking mode',
          children: (
            <StakingMode />
          ),
        },
      ]}
    />
  );
}
