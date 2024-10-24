import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from 'rc-tooltip';
import { ethSelectors } from '../../../../redux/selectors';
import { ethActions } from '../../../../redux/actions';
import { formatCustom } from '../../../../utils/walletHelpers';
import Table from '../../../Table';
import Button from '../../../Button/Button';
import styles from './styles.module.scss';

function TokenStakeInfo() {
  const dispatch = useDispatch();
  const tokenStakeInfo = useSelector(ethSelectors.selectorTokenStakeContractInfo);
  const tokenStakeInfoLoading = useSelector(ethSelectors.selectorTokenStakeContractInfoLoading);
  const erc20Info = useSelector(ethSelectors.selectorERC20Info);

  const getTokenStake = () => dispatch(ethActions.getTokenStakeContractInfo.call());
  const getERC20Info = (erc20Address) => dispatch(ethActions.getErc20Info.call({ erc20Address }));

  const erc20FromSelector = (erc20Address) => {
    const mapped = erc20Info[erc20Address];
    if (!mapped || mapped.loading || mapped.error) {
      return undefined;
    }
    return mapped;
  };

  React.useEffect(() => {
    getTokenStake();
  }, []);

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

  const rewardTokenInfo = erc20FromSelector(tokenStakeInfo.rewardToken);
  const stakingTokenInfo = erc20FromSelector(tokenStakeInfo.stakingToken);

  return (
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
              info: 'Reward token balance',
              value: `${formatCustom(tokenStakeInfo.getRewardTokenBalance.toString(), tokenStakeInfo.rewardTokenDecimals)}${
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
            }
          ]}
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button green small onClick={() => getTokenStake()}>
          Refresh data
        </Button>
      </div>
    </div>
  );
}

export default TokenStakeInfo;