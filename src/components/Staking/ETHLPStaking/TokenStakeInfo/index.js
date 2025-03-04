import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import Spin from 'antd/es/spin';
import { ethSelectors } from '../../../../redux/selectors';
import { ethActions } from '../../../../redux/actions';
import { formatCustom } from '../../../../utils/walletHelpers';
import Table from '../../../Table';
import Button from '../../../Button/Button';
import StakeForm from '../StakeForm';
import StakeEthForm from '../StakeEthForm';
import ClaimReward from '../ClaimReward';
import WithdrawForm from '../WithdrawForm';
import CopyIconWithAddress from '../../../CopyIconWithAddress';

function TokenStakeInfo({ selectedAccount }) {
  const dispatch = useDispatch();
  const tokenStakeInfo = useSelector(ethSelectors.selectorTokenStakeContractInfo);
  const tokenStakeAddressInfo = useSelector(ethSelectors.selectorTokenStakeAddressInfo);
  const erc20Info = useSelector(ethSelectors.selectorERC20Info);
  const erc20Balance = useSelector(ethSelectors.selectorERC20Balance);

  const getTokenStake = () => dispatch(ethActions.getTokenStakeContractInfo.call());
  const getERC20Info = (erc20Address) => dispatch(ethActions.getErc20Info.call({ erc20Address }));
  const getTokenAddressInfo = (userEthAddress) => dispatch(
    ethActions.getTokenStakeAddressInfo.call({ userEthAddress }),
  );
  const getERC20Balance = (erc20Address, account) => dispatch(
    ethActions.getErc20Balance.call({ erc20Address, account }),
  );
  const getAddressRelated = () => {
    if (selectedAccount && tokenStakeInfo && !tokenStakeInfo.error) {
      getTokenAddressInfo(selectedAccount);
      getERC20Balance(tokenStakeInfo.rewardToken, selectedAccount);
      getERC20Balance(tokenStakeInfo.stakingToken, selectedAccount);
    }
  };
  const selectTokenStakeAddressInfo = (account) => {
    if (!selectedAccount
      || !tokenStakeAddressInfo[account]
      || tokenStakeAddressInfo[account].loading
      || tokenStakeAddressInfo[account].error
    ) {
      return undefined;
    }
    return tokenStakeAddressInfo[account];
  };

  const erc20FromSelector = (erc20Address) => {
    const mapped = erc20Info?.[erc20Address];
    if (!mapped) {
      return undefined;
    }
    return mapped;
  };
  const erc20BalanceFromSelector = (erc20Address, account) => {
    const mapped = account && erc20Balance?.[erc20Address]?.[account];
    if (!mapped) {
      return undefined;
    }
    return mapped;
  };

  useEffect(() => {
    getTokenStake();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAddressRelated();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccount, tokenStakeInfo]);

  useEffect(() => {
    if (tokenStakeInfo) {
      getERC20Info(tokenStakeInfo.rewardToken);
      getERC20Info(tokenStakeInfo.stakingToken);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenStakeInfo]);

  if (!tokenStakeInfo) {
    return <Spin />;
  }

  const rewardTokenInfo = erc20FromSelector(tokenStakeInfo?.rewardToken);
  const stakingTokenInfo = erc20FromSelector(tokenStakeInfo?.stakingToken);
  const rewardTokenBalance = erc20BalanceFromSelector(tokenStakeInfo?.rewardToken, selectedAccount);
  const stakingTokenBalance = erc20BalanceFromSelector(tokenStakeInfo?.stakingToken, selectedAccount);
  const addressInfo = selectTokenStakeAddressInfo(selectedAccount);
  const tokensStakedLoader = () => (addressInfo
    ? `${formatCustom(addressInfo.stake[0].toString(), tokenStakeInfo.stakingTokenDecimals)}${
      stakingTokenInfo ? ` ${stakingTokenInfo.symbol}` : ''}`
    : 'Loading...');
  const rewardsLoader = () => (addressInfo
    ? `${formatCustom(addressInfo.stake[1].toString(), tokenStakeInfo.rewardTokenDecimals)}${
      rewardTokenInfo ? ` ${rewardTokenInfo.symbol}` : ''}`
    : 'Loading...');
  const rewardInAccountLoader = () => (!rewardTokenBalance || !tokenStakeInfo
    ? 'Loading...'
    : `${formatCustom(rewardTokenBalance.balance.toString(), tokenStakeInfo.rewardTokenDecimals)}${
      rewardTokenInfo ? ` ${rewardTokenInfo.symbol}` : ''}`);
  const stakingInAccountLoader = () => (!stakingTokenBalance || !tokenStakeInfo
    ? 'Loading...'
    : `${formatCustom(stakingTokenBalance.balance.toString(), tokenStakeInfo.stakingTokenDecimals)}${
      stakingTokenInfo ? ` ${stakingTokenInfo.symbol}` : ''}`);

  return (
    <Table
      noPagination
      footer={(
        <Flex wrap gap="15px" justify="end">
          {selectedAccount && stakingTokenInfo && stakingTokenBalance && (
            <>
              <StakeForm
                account={selectedAccount}
                stakingToken={{
                  ...stakingTokenInfo,
                  address: tokenStakeInfo.stakingToken,
                  balance: stakingTokenBalance.balance.toString(),
                  decimals: parseInt(tokenStakeInfo.stakingTokenDecimals.toString()),
                }}
              />
              <StakeEthForm
                account={selectedAccount}
              />
            </>
          )}
          {selectedAccount && stakingTokenInfo && addressInfo && (
            <WithdrawForm
              account={selectedAccount}
              stakingToken={{
                ...stakingTokenInfo,
                address: tokenStakeInfo.stakingToken,
                balance: addressInfo.stake[0].toString(),
                decimals: parseInt(tokenStakeInfo.stakingTokenDecimals.toString()),
              }}
            />
          )}
          <Button
            green
            onClick={() => {
              getTokenStake();
              getAddressRelated();
            }}
          >
            Refresh data
          </Button>
          {selectedAccount && (
            <ClaimReward account={selectedAccount} />
          )}
        </Flex>
      )}
      columns={[
        {
          Header: 'ETH/LP Contract details',
          accessor: 'info',
        },
        {
          Header: '',
          accessor: 'value',
        },
      ]}
      data={[
        {
          info: 'Tokens staked',
          value: !selectedAccount
            ? 'Select wallet and account'
            : tokensStakedLoader(),
        },
        {
          info: 'Your rewards',
          value: !selectedAccount
            ? 'Select wallet and account'
            : rewardsLoader(),
        },
        {
          info: 'Reward ratio',
          value: parseFloat(
            (10000n * tokenStakeInfo.getRewardRatio[0]) / tokenStakeInfo.getRewardRatio[1],
          ) / 10000,
        },
        {
          info: 'Reward interval',
          value: `${Number(tokenStakeInfo.getTimeUnit) / (60 * 60 * 24)} days`,
        },
        {
          info: 'Reward token',
          value: (
            <Flex wrap gap="10px" align="center">
              {rewardTokenInfo
                ? rewardTokenInfo.name
                : `${tokenStakeInfo.rewardToken.slice(0, 7)}...`}
              <div className="description">
                <CopyIconWithAddress address={tokenStakeInfo.rewardToken} />
              </div>
            </Flex>
          ),
        },
        {
          info: 'Reward token contract balance',
          value: `${formatCustom(
            tokenStakeInfo.getRewardTokenBalance.toString(),
            tokenStakeInfo.rewardTokenDecimals,
          )}${
            rewardTokenInfo ? ` ${rewardTokenInfo.symbol}` : ''}`,
        },
        {
          info: 'Reward token in your account',
          value: !selectedAccount
            ? 'Select wallet and account'
            : rewardInAccountLoader(),
        },
        {
          info: 'Staking token',
          value: (
            <Flex wrap gap="10px" align="center">
              {stakingTokenInfo
                ? stakingTokenInfo.name
                : `${tokenStakeInfo.stakingToken.slice(0, 7)}...`}
              <div className="description">
                <CopyIconWithAddress address={tokenStakeInfo.stakingToken} />
              </div>
            </Flex>
          ),
        },
        {
          info: 'Staking token balance',
          value: `${formatCustom(
            tokenStakeInfo.stakingTokenBalance.toString(),
            tokenStakeInfo.stakingTokenDecimals,
          )}${
            stakingTokenInfo ? ` ${stakingTokenInfo.symbol}` : ''}`,
        },
        {
          info: 'Staking token in your account',
          value: !selectedAccount
            ? 'Select wallet and account'
            : stakingInAccountLoader(),
        },
      ]}
    />
  );
}

TokenStakeInfo.propTypes = {
  selectedAccount: PropTypes.string,
};

export default TokenStakeInfo;
