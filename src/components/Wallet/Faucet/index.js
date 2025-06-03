import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  Button,
  Typography,
  Alert,
  Spin,
  Flex,
  Result,
  message,
} from 'antd';
import { GiftOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { blockchainSelectors, walletSelectors } from '../../../redux/selectors';
import { walletActions } from '../../../redux/actions';
import { isTestnet, getNetworkName } from '../../../utils/networkHelpers';
import { formatDollars, formatMerits } from '../../../utils/walletHelpers';
import { claimFaucetLLD, claimFaucetLLM } from '../../../api/middleware';
import { getFaucetTimeUntilNextFunding, getFaucetLldAmount, getFaucetLlmAmount } from '../../../api/nodeRpcCall';
import styles from './styles.module.scss';

const { Title, Paragraph } = Typography;

// Base faucet configuration (will be updated with contract amounts)
const FAUCET_CONFIG = {
  LLD: {
    amount: 0, // Will be fetched from contract
    dailyLimit: 0, // Will be fetched from contract
    symbol: 'LLD',
    name: 'Liberland Dollar',
  },
  LLM: {
    amount: 0, // Will be fetched from contract
    dailyLimit: 0, // Will be fetched from contract
    symbol: 'LLM',
    name: 'Liberland Merit',
  },
};

const COOLDOWN_HOURS = 24;

function Faucet() {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const walletInfo = useSelector(walletSelectors.selectorWalletInfo);
  const isWalletLoading = useSelector(walletSelectors.selectorGettingWalletInfo);

  const [loading, setLoading] = useState({ LLD: false, LLM: false });
  const [timeUntilNext, setTimeUntilNext] = useState({ LLD: null, LLM: null });
  const [checkingCooldown, setCheckingCooldown] = useState(false);
  const [faucetAmounts, setFaucetAmounts] = useState({ LLD: null, LLM: null });
  const [loadingAmounts, setLoadingAmounts] = useState(true);

  const fetchFaucetAmounts = useCallback(async () => {
    setLoadingAmounts(true);
    try {
      const [lldAmount, llmAmount] = await Promise.all([
        getFaucetLldAmount(),
        getFaucetLlmAmount(),
      ]);

      const formattedLldAmount = lldAmount ? Math.floor(lldAmount / 1e12) : 0;
      const formattedLlmAmount = llmAmount ? Math.floor(llmAmount / 1e12) : 0;

      setFaucetAmounts({
        LLD: formattedLldAmount,
        LLM: formattedLlmAmount,
      });

      FAUCET_CONFIG.LLD.amount = formattedLldAmount;
      FAUCET_CONFIG.LLD.dailyLimit = formattedLldAmount;
      FAUCET_CONFIG.LLM.amount = formattedLlmAmount;
      FAUCET_CONFIG.LLM.dailyLimit = formattedLlmAmount;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching faucet amounts:', error);
      message.error('Failed to fetch faucet amounts from contract');
    } finally {
      setLoadingAmounts(false);
    }
  }, []);

  const checkCooldownTimes = useCallback(async () => {
    if (!userWalletAddress) return;

    setCheckingCooldown(true);
    try {
      const [lldTime, llmTime] = await Promise.all([
        getFaucetTimeUntilNextFunding(userWalletAddress, 'LLD'),
        getFaucetTimeUntilNextFunding(userWalletAddress, 'LLM'),
      ]);

      setTimeUntilNext({
        LLD: lldTime,
        LLM: llmTime,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error checking cooldown times:', error);
      message.error('Failed to check faucet cooldown status');
    } finally {
      setCheckingCooldown(false);
    }
  }, [userWalletAddress]);

  useEffect(() => {
    fetchFaucetAmounts();
  }, [fetchFaucetAmounts]);

  useEffect(() => {
    checkCooldownTimes();
    const interval = setInterval(checkCooldownTimes, 60000);
    return () => clearInterval(interval);
  }, [checkCooldownTimes]);

  if (!isTestnet()) {
    return (
      <Result
        icon={<GiftOutlined />}
        title="Faucet Not Available"
        subTitle={`The faucet is only available on testnet. You are currently connected to ${getNetworkName()}.`}
      />
    );
  }

  const canClaim = (tokenType) => {
    const timeRemaining = timeUntilNext[tokenType];

    if (timeRemaining === null || timeRemaining === undefined) {
      return {
        canClaim: false,
        reason: 'Checking...',
        timeUntilNextClaim: 0,
      };
    }

    if (timeRemaining > 0) {
      return {
        canClaim: false,
        reason: 'Cooldown active',
        timeUntilNextClaim: timeRemaining,
      };
    }

    return {
      canClaim: true,
      reason: null,
      timeUntilNextClaim: 0,
    };
  };

  const formatTimeRemaining = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleClaim = async (tokenType) => {
    if (!userWalletAddress) return;

    const claimStatus = canClaim(tokenType);
    if (!claimStatus.canClaim) return;

    setLoading((prev) => ({ ...prev, [tokenType]: true }));

    try {
      const claimAmount = faucetAmounts[tokenType] || FAUCET_CONFIG[tokenType].amount;

      if (tokenType === 'LLD') {
        await claimFaucetLLD(userWalletAddress);
      } else {
        await claimFaucetLLM(userWalletAddress);
      }

      message.success(`Successfully claimed ${claimAmount} ${tokenType}!`);

      dispatch(walletActions.getWallet.call(userWalletAddress));
      await checkCooldownTimes();
      await fetchFaucetAmounts();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error claiming ${tokenType}:`, error);
      message.error(error.message || `Failed to claim ${tokenType}`);
    } finally {
      setLoading((prev) => ({ ...prev, [tokenType]: false }));
    }
  };

  const renderClaimButton = (tokenType) => {
    const claimStatus = canClaim(tokenType);
    const config = FAUCET_CONFIG[tokenType];
    const isLoading = loading[tokenType];
    const amount = faucetAmounts[tokenType];

    if (loadingAmounts) {
      return (
        <Button
          className={`${styles.claimButton} ${styles.disabled}`}
          size="large"
          disabled
        >
          <Spin size="small" />
          {' '}
          Loading amounts...
        </Button>
      );
    }

    if (isLoading) {
      return (
        <Button
          className={`${styles.claimButton} ${styles.primary}`}
          size="large"
          disabled
        >
          <Spin size="small" />
          {' '}
          Claiming...
        </Button>
      );
    }

    if (checkingCooldown) {
      return (
        <Button
          className={`${styles.claimButton} ${styles.disabled}`}
          size="large"
          disabled
        >
          <Spin size="small" />
          {' '}
          Checking...
        </Button>
      );
    }

    if (!claimStatus.canClaim) {
      if (claimStatus.reason === 'Checking...') {
        return (
          <Button
            className={`${styles.claimButton} ${styles.disabled}`}
            size="large"
            disabled
          >
            Checking status...
          </Button>
        );
      }

      const timeRemaining = formatTimeRemaining(claimStatus.timeUntilNextClaim);
      return (
        <Button
          className={`${styles.claimButton} ${styles.disabled}`}
          size="large"
          disabled
          icon={<ClockCircleOutlined />}
        >
          Wait
          {' '}
          {timeRemaining}
        </Button>
      );
    }

    return (
      <Button
        className={`${styles.claimButton} ${styles.primary}`}
        type="primary"
        size="large"
        icon={<GiftOutlined />}
        onClick={() => handleClaim(tokenType)}
      >
        Claim
        {' '}
        {amount || config.amount}
        {' '}
        {config.symbol}
      </Button>
    );
  };

  // Get balance display text
  const getBalanceDisplayText = (tokenType, balance) => {
    if (!balance) return '0';
    return tokenType === 'LLD' ? formatDollars(balance) : formatMerits(balance);
  };

  // Get status display text
  const getStatusDisplayText = (claimStatus) => {
    if (claimStatus.reason === 'Checking...') return 'Checking status...';
    if (claimStatus.canClaim) return 'Available now';
    return `Available in ${formatTimeRemaining(claimStatus.timeUntilNextClaim)}`;
  };

  // Get status CSS class
  const getStatusClass = (claimStatus) => {
    if (claimStatus.reason === 'Checking...') return '';
    return claimStatus.canClaim ? styles.available : styles.cooldown;
  };

  // Render token card
  const renderTokenCard = (tokenType) => {
    const config = FAUCET_CONFIG[tokenType];
    const claimStatus = canClaim(tokenType);
    const contractAmount = faucetAmounts[tokenType];

    // Use real balance
    const balance = tokenType === 'LLD'
      ? walletInfo?.balances?.liquidAmount?.amount
      : walletInfo?.balances?.liquidMerits?.amount;

    return (
      <Card
        className={styles.tokenCard}
        title={(
          <Flex align="center" justify="center" gap={8}>
            <GiftOutlined />
            <span>
              {config.name}
              {' '}
              (
              {config.symbol}
              )
            </span>
          </Flex>
        )}
      >
        <Flex vertical gap={24}>
          {/* Balance Section */}
          <div className={styles.balanceSection}>
            <div className={styles.balanceLabel}>Current Balance</div>
            <div className={styles.balanceValue}>
              {getBalanceDisplayText(tokenType, balance)}
              {' '}
              {config.symbol}
            </div>
          </div>

          {/* Status Section */}
          <div className={styles.statusSection}>
            <div className={styles.statusLabel}>Next Claim</div>
            <div className={`${styles.statusValue} ${getStatusClass(claimStatus)}`}>
              {getStatusDisplayText(claimStatus)}
            </div>
          </div>

          {/* Claim Button */}
          {renderClaimButton(tokenType)}

          {/* Info Alert */}
          <Alert
            className={styles.infoAlert}
            message={loadingAmounts
              ? `Loading ${config.symbol} amount from contract...`
              : `Claim ${contractAmount || config.amount} ${config.symbol} every ${COOLDOWN_HOURS} hours`}
            description="Cooldown times and amounts are managed by the blockchain faucet contract"
            type="info"
            showIcon
            icon={<CheckCircleOutlined />}
          />
        </Flex>
      </Card>
    );
  };

  if (isWalletLoading) {
    return (
      <div className={styles.container}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2}>
          <GiftOutlined />
          {' '}
          Testnet Faucet
        </Title>
        <Paragraph>
          Get free LLD and LLM tokens for testing on
          {' '}
          {getNetworkName()}
          .
          Cooldown times are managed by the faucet contract.
        </Paragraph>

        <Alert
          message="Testnet Only"
          description="This faucet is only available on testnet for development and testing purposes."
          type="warning"
          showIcon
          className={styles.testnetAlert}
          style={{ marginBottom: 24 }}
        />
      </div>

      <div className={styles.cardsContainer}>
        {renderTokenCard('LLD')}
        {renderTokenCard('LLM')}
      </div>

      <div className={styles.info}>
        <Title level={4}>How it works:</Title>
        <ul>
          <li>Cooldown times are managed by the faucet contract</li>
          <li>Claims are processed through secure middleware APIs</li>
          <li>
            Each claim gives you exactly
            {' '}
            {FAUCET_CONFIG.LLD.amount}
            {' '}
            tokens of LLD and
            {' '}
            {FAUCET_CONFIG.LLM.amount}
            {' '}
            tokens of LLM
          </li>
          <li>Only available on testnet environments</li>
        </ul>
      </div>
    </div>
  );
}

export default Faucet;
