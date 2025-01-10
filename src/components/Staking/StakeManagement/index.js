import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import Spin from 'antd/es/spin';
import { validatorSelectors, walletSelectors } from '../../../redux/selectors';
import { formatDollars } from '../../../utils/walletHelpers';
import {
  StakeLLDModal,
  StakingRewardsDestinationModal,
  StartValidatorModal,
  UnbondModal,
} from '../../Modals';
import Table from '../../Table';
import WithdrawUnbondedButton from './WithdrawUnbondedButton';
import PayoutRewards from './PayoutRewards';
import Unbonding from './Unbonding';
import { validatorActions } from '../../../redux/actions';
import Button from '../../Button/Button';

export default function StakeManagement() {
  const balances = useSelector(walletSelectors.selectorBalances);
  const info = useSelector(validatorSelectors.info);
  const pendingRewards = useSelector(validatorSelectors.pendingRewards);
  const payee = useSelector(validatorSelectors.payee);
  const dispatch = useDispatch();
  const chill = () => {
    dispatch(validatorActions.chill.call());
  };

  useEffect(() => {
    dispatch(validatorActions.getPayee.call());
  }, [dispatch]);

  if (!balances) {
    return <Spin />;
  }

  return info?.stash ? (
    <Table
      columns={[
        {
          Header: 'LLD Staking information',
          accessor: 'name',
        },
        {
          Header: 'Value',
          accessor: 'value',
        },
      ]}
      noPagination
      footer={(
        <Flex wrap gap="15px" justify="end">
          {info.isStakingValidator ? (
            <Button primary onClick={chill}>
              Switch to Nominator
            </Button>
          ) : (
            <StartValidatorModal label="Switch to Validator" />
          )}
          <StakeLLDModal label="Add stake" />
          <WithdrawUnbondedButton />
          <UnbondModal />
          <StakingRewardsDestinationModal />
          <PayoutRewards />
        </Flex>
      )}
      data={[
        {
          name: 'Currently staked',
          value: `${formatDollars(balances.polkastake.amount)} LLD`,
        },
        {
          name: 'Current staking mode',
          value: info.isStakingValidator
            ? 'Validator'
            : 'Nominator',
        },
        {
          name: 'Rewards pending',
          value: `${formatDollars(pendingRewards ?? 0)} LLD`,
        },
        {
          name: 'Staking rewards destination',
          value: `${payee?.toString() || 'None'}`,
        },
        {
          name: 'Unstaking',
          value: <Unbonding info={info} />,
        },
      ]}
    />
  ) : null;
}
