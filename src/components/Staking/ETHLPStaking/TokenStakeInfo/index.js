import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from 'rc-tooltip';
import { ethSelectors } from '../../../../redux/selectors';
import { ethActions } from '../../../../redux/actions';
import { formatCustom } from '../../../../utils/walletHelpers';
import Table from '../../../Table';
import Button from '../../../Button/Button';
import StakeForm from '../StakeForm';
import ClaimReward from '../ClaimReward';
import styles from './styles.module.scss';

function TokenStakeInfo({ selectedAccount }) {
  const dispatch = useDispatch();
  const tokenStakeInfo = useSelector(ethSelectors.selectorTokenStakeContractInfo);
  const tokenStakeAddressInfo = useSelector(ethSelectors.selectorTokenStakeAddressInfo);
  const tokenStakeInfoLoading = useSelector(ethSelectors.selectorTokenStakeContractInfoLoading);
  const erc20Info = useSelector(ethSelectors.selectorERC20Info);
  const erc20Balance = useSelector(ethSelectors.selectorERC20Balance);

  const getTokenStake = () => dispatch(ethActions.getTokenStakeContractInfo.call());
  const getERC20Info = (erc20Address) => dispatch(ethActions.getErc20Info.call({ erc20Address }));
  const getTokenAddressInfo = (userEthAddress) => dispatch(ethActions.getTokenStakeAddressInfo.call({ userEthAddress }));
  const getERC20Balance = (erc20Address, account) => dispatch(ethActions.getErc20Balance.call({ erc20Address, account }));
  const getAddressRelated = () => {
    if (selectedAccount && tokenStakeInfo && !tokenStakeInfo.error) {
      getTokenAddressInfo(selectedAccount);
      getERC20Balance(tokenStakeInfo.rewardToken, selectedAccount);
      getERC20Balance(tokenStakeInfo.stakingToken, selectedAccount);
    }
  };
  const selectTokenStakeAddressInfo = (account) => {
    if (!selectedAccount ||
      !tokenStakeAddressInfo[account] ||
      tokenStakeAddressInfo[account].loading ||
      tokenStakeAddressInfo[account].error
    ) {
      return undefined;
    }
    return tokenStakeAddressInfo[account];
  };

  const erc20FromSelector = (erc20Address) => {
    const mapped = erc20Info[erc20Address];
    if (!mapped || mapped.loading || mapped.error) {
      return undefined;
    }
    return mapped;
  };
  const erc20BalanceFromSelector = (erc20Address, account) => {
    const mapped = account && erc20Balance[erc20Address]?.[account];
    if (!mapped || mapped.loading || mapped.error) {
      return undefined;
    }
    return mapped;
  };

  React.useEffect(() => {
    getTokenStake();
  }, []);

  React.useEffect(() => {
    getAddressRelated();
  }, [selectedAccount, tokenStakeInfo]);

  React.useEffect(() => {
    if (tokenStakeInfo && !tokenStakeInfo.error) {
      getERC20Info(tokenStakeInfo.rewardToken);
      getERC20Info(tokenStakeInfo.stakingToken);
    }
  }, [tokenStakeInfo]);

  if (!tokenStakeInfo || tokenStakeInfoLoading) {
    return <div>Loading...</div>;
  }

  if (tokenStakeInfo.error) {
    return (
      <div className={styles.error}>
        Something went wrong
      </div>
    );
  }

  const rewardTokenInfo = erc20FromSelector(tokenStakeInfo?.rewardToken);
  const stakingTokenInfo = erc20FromSelector(tokenStakeInfo?.stakingToken);
  const rewardTokenBalance = erc20BalanceFromSelector(tokenStakeInfo?.rewardToken, selectedAccount);
  const stakingTokenBalance = erc20BalanceFromSelector(tokenStakeInfo?.stakingToken, selectedAccount);
  const addressInfo = selectTokenStakeAddressInfo(selectedAccount);

  return (
    <div>
      {selectedAccount && stakingTokenInfo && stakingTokenBalance && (
        <StakeForm account={selectedAccount} stakingToken={{
          ...stakingTokenInfo,
          address: tokenStakeInfo.stakingToken,
          balance: stakingTokenBalance.balance.toString(),
          decimals: parseInt(tokenStakeInfo.stakingTokenDecimals.toString()),
        }} />
      )}
      <div className={styles.detailContainer}>
        <div className={styles.tableContainer}>
          <Table
            columns={[
              {
                Header: 'ETH/LP Contract details',
                accessor: 'info',
              },
              {
                Header: '',
                accessor: 'value',
              }
            ]}
            data={[
              {
                info: 'Tokens staked',
                value: !selectedAccount 
                  ? 'Select wallet and account'
                  : addressInfo 
                  ? `${formatCustom(addressInfo.stake[0].toString(), tokenStakeInfo.stakingTokenDecimals)}${
                      stakingTokenInfo ? ` ${stakingTokenInfo.symbol}` : ""}`
                  : 'Loading...',
              },
              {
                info: 'Your rewards',
                value: !selectedAccount 
                  ? 'Select wallet and account'
                  : addressInfo 
                  ? `${formatCustom(addressInfo.stake[1].toString(), tokenStakeInfo.rewardTokenDecimals)}${
                      rewardTokenInfo ? ` ${rewardTokenInfo.symbol}` : ""}`
                  : 'Loading...',
              },
              {
                info: 'Reward ratio',
                value: parseFloat((10000n * tokenStakeInfo.getRewardRatio[0]) / tokenStakeInfo.getRewardRatio[1]) / 10000,
              },
              {
                info: 'Reward interval',
                value: `${Number(tokenStakeInfo.getTimeUnit) / (60 * 60 * 24)} days`,
              },
              {
                info: 'Reward token',
                value: (
                  <Tooltip placement='top' showArrow={false} trigger={['hover', 'click']} overlay={<span>{tokenStakeInfo.rewardToken}</span>}>
                    <div>
                      {rewardTokenInfo
                        ? rewardTokenInfo.name
                        : `${tokenStakeInfo.rewardToken.slice(0, 7)}...`}
                    </div>
                  </Tooltip>
                )
              },
              {
                info: 'Reward token contract balance',
                value: `${formatCustom(tokenStakeInfo.getRewardTokenBalance.toString(), tokenStakeInfo.rewardTokenDecimals)}${
                  rewardTokenInfo ? ` ${rewardTokenInfo.symbol}` : ""}`
              },
              {
                info: 'Reward token in your account',
                value: !selectedAccount
                  ? 'Select wallet and account'
                  : !rewardTokenBalance || !tokenStakeInfo
                  ? 'Loading...'
                  :  `${formatCustom(rewardTokenBalance.balance.toString(), tokenStakeInfo.rewardTokenDecimals)}${
                  rewardTokenInfo ? ` ${rewardTokenInfo.symbol}` : ""}`
              },
              {
                info: 'Staking token',
                value: (
                  <Tooltip placement='top' showArrow={false} trigger={['hover', 'click']} overlay={<span>{tokenStakeInfo.stakingToken}</span>}>
                    <div>
                      {stakingTokenInfo
                        ? stakingTokenInfo.name
                        : `${tokenStakeInfo.stakingToken.slice(0, 7)}...`}
                    </div>
                  </Tooltip>
                )
              },
              {
                info: 'Staking token balance',
                value: `${formatCustom(tokenStakeInfo.stakingTokenBalance.toString(), tokenStakeInfo.stakingTokenDecimals)}${
                  stakingTokenInfo ? ` ${stakingTokenInfo.symbol}` : ""}`,
              },
              {
                info: 'Staking token in your account',
                value: !selectedAccount
                  ? 'Select wallet and account'
                  : !stakingTokenBalance || !tokenStakeInfo
                  ? 'Loading...'
                  :  `${formatCustom(stakingTokenBalance.balance.toString(), tokenStakeInfo.stakingTokenDecimals)}${
                  stakingTokenInfo ? ` ${stakingTokenInfo.symbol}` : ""}`
              },
            ]}
          />
        </div>
        <div className={styles.buttonContainer}>
          <Button 
            green
            small
            onClick={() => {
              getTokenStake();
              getAddressRelated();
            }}>
            Refresh data
          </Button>
          {selectedAccount && tokenStakeInfo && (
            <ClaimReward account={selectedAccount} erc20Address={tokenStakeInfo.stakingToken} />
          )}
        </div>
      </div>
    </div>
  );
}

TokenStakeInfo.propTypes = {
  selectedAccount: PropTypes.string,
};

export default TokenStakeInfo;