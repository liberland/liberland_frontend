import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spin from 'antd/es/spin';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import { useMediaQuery } from 'usehooks-ts';
import { blockchainSelectors, validatorSelectors, walletSelectors } from '../../../redux/selectors';
import { formatDollars } from '../../../utils/walletHelpers';
import LLD from '../../../assets/icons/lld.svg';
import {
  StakeLLDModal,
  StakingRewardsDestinationModal,
  UnbondModal,
} from '../../Modals';
import WithdrawUnbondedButton from './WithdrawUnbondedButton';
import PayoutRewards from './PayoutRewards';
import Unbonding from './Unbonding';
import { validatorActions } from '../../../redux/actions';
import styles from './styles.module.scss';
import MoneyCard from '../../MoneyCard';
import { blockTimeFormatted, stakingInfoToProgress } from '../../../utils/staking';

export default function StakeManagement() {
  const balances = useSelector(walletSelectors.selectorBalances);
  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const info = useSelector(validatorSelectors.info);
  const pendingRewards = useSelector(validatorSelectors.pendingRewards);
  const payee = useSelector(validatorSelectors.payee);
  const { stakingInfo, sessionProgress } = useSelector(validatorSelectors.stakingData);
  const dispatch = useDispatch();
  const isBiggerThanDesktop = useMediaQuery('(min-width: 1500px)');
  const stakingData = stakingInfoToProgress(stakingInfo, sessionProgress) ?? [];
  const { unlock, blocks } = stakingData?.[0] || {};

  useEffect(() => {
    if (info.unlocking.length !== 0) {
      dispatch(validatorActions.getStakingData.call());
    }
  }, [dispatch, blockNumber, info]);
  useEffect(() => {
    if (info?.unlocking?.length) {
      dispatch(validatorActions.getStakingData.call());
    }
  }, [dispatch, info]);

  useEffect(() => {
    dispatch(validatorActions.getPayee.call());
  }, [dispatch]);

  if (!balances) {
    return <Spin />;
  }

  const rewardsDescription = (() => {
    switch (payee?.toString()) {
      case 'Staked':
        return 'Rewards will be automatically staked';
      case 'Stash':
        return 'Rewards will be deposited in your account';
      default:
        return '';
    }
  })();

  return (
    <Row gutter={16} className={!isBiggerThanDesktop && styles.row}>
      <Col span={isBiggerThanDesktop ? 6 : 24}>
        <MoneyCard
          actions={[
            <StakeLLDModal label="Stake LLD" />,
            <UnbondModal />,
          ]}
          amount={`${formatDollars(balances.polkastake.amount)} LLD`}
          currency="LLD"
          icon={LLD}
          title="Currently staked"
        />
      </Col>
      <Col span={isBiggerThanDesktop ? 6 : 24}>
        <MoneyCard
          actions={[
            <PayoutRewards />,
          ]}
          title="Rewards pending"
          amount={`${formatDollars(pendingRewards ?? 0)} LLD`}
          currency="LLD"
          icon={LLD}
        />
      </Col>
      <Col span={isBiggerThanDesktop ? 6 : 24}>
        <MoneyCard
          amount={payee?.toString() || 'None'}
          title="Rewards destination"
          description={rewardsDescription}
          actions={[
            <StakingRewardsDestinationModal />,
          ]}
        />
      </Col>
      <Col span={isBiggerThanDesktop ? 6 : 24}>
        <MoneyCard
          amount={`${formatDollars(stakingInfo?.redeemable || '0')} LLD to withdraw`}
          currency="LLD"
          icon={LLD}
          title="Unstaking"
          description={(
            unlock?.value && blocks && `${formatDollars(unlock?.value)} will unlock in ${blockTimeFormatted(blocks)}`
          )}
          actions={[
            stakingData?.length > 1 && <Unbonding info={info} />,
            <WithdrawUnbondedButton />,
          ].filter(Boolean)}
        />
      </Col>
    </Row>
  );
}
