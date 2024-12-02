import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import ModalRoot from '../../../Modals/ModalRoot';
import { ethSelectors } from '../../../../redux/selectors';
import { ethActions } from '../../../../redux/actions';
import { TextInput } from '../../../InputComponents';
import Button from '../../../Button/Button';
import ProgressBar from '../../../InputComponents/ProgressBar';
import {
  formatCustom as formatCustomUnsafe,
  parseAssets as parseAssetsUnsafe,
} from '../../../../utils/walletHelpers';
import { stakeLPWithEth } from '../../../../api/ethereum';
import styles from './styles.module.scss';

const formatCustom = (value) => {
  try {
    return formatCustomUnsafe(value, 18, true)
      .toString()
      .replace(/,/g, '');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return '0';
  }
};

const parseAssets = (value) => {
  try {
    return parseAssetsUnsafe(value, 18, true).toString();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return '0';
  }
};

function StakeEthForm({
  account,
  onClose,
}) {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    setError,
    formState: {
      errors,
      isSubmitting,
      isSubmitSuccessful,
    },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      tolerance: '90',
    },
  });

  const dispatch = useDispatch();
  const [results, setResults] = useState(0);
  const connected = useSelector(ethSelectors.selectorConnected);
  const balance = useSelector(ethSelectors.selectorBalance);

  const onSubmit = async ({ stake, tokens, tolerance }) => {
    try {
      const realStake = parseAssets(stake);
      const realTokens = parseAssets(tokens);
      const signer = await connected.provider.getSigner(account);
      const getAmountWithTolerance = (amount) => (
        ((window.BigInt(amount) * window.BigInt(tolerance)) / window.BigInt(100)).toString()
      );
      setResults(await stakeLPWithEth(
        signer,
        realStake,
        getAmountWithTolerance(realStake),
        realTokens,
        getAmountWithTolerance(realTokens),
        connected.provider,
      ));
      dispatch(ethActions.getWethLpExchangeRate.call());
      dispatch(ethActions.getBalance.call({ provider: connected.provider, address: account }));
      dispatch(ethActions.getErc20Balance.call(
        process.env.REACT_APP_THIRD_WEB_LLD_ADDRESS,
        account,
      ));
    } catch (e) {
      setError('stake', {
        message: 'Something went wrong',
      });
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const stake = watch('stake', '');
  const tokens = watch('tokens', '');
  const [stakeFocused, setStakeFocused] = useState(false);
  const [tokensFocused, setTokensFocused] = useState(false);
  const tolerance = watch('tolerance', '90');
  const exchangeRate = useSelector(ethSelectors.selectorWethLpExchangeRate);
  const exchangeRateLoading = useSelector(ethSelectors.selectorWethLpExchangeRateLoading);
  const exchangeRateError = useSelector(ethSelectors.selectorWethLpExchangeRateError);
  const lldBalances = useSelector(ethSelectors.selectorERC20Balance)?.[process.env.REACT_APP_THIRD_WEB_LLD_ADDRESS];

  React.useEffect(() => {
    dispatch(ethActions.getWethLpExchangeRate.call());
    dispatch(ethActions.getBalance.call({ provider: connected.provider, address: account }));
    dispatch(ethActions.getErc20Balance.call(
      process.env.REACT_APP_THIRD_WEB_LLD_ADDRESS,
      account,
    ));
  }, [account, dispatch, connected]);

  const lldBalance = React.useMemo(
    () => formatCustom(lldBalances?.[account]?.balance?.toString() || '0'),
    [account, lldBalances],
  );

  const formattedBalance = formatCustom(balance || '0');

  const liquidityPoolReward = React.useMemo(() => {
    if (stake && tokens && exchangeRate && !errors.stake && !errors.token) {
      try {
        const lpTokens = exchangeRate.rewardRate({
          eth: window.BigInt(parseAssets(stake)),
          tokenAmount: window.BigInt(parseAssets(tokens)),
        });
        return `Receive ${formatCustom(lpTokens)} LP tokens`;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
    return 'No reward calculated';
  }, [exchangeRate, stake, tokens, errors]);

  React.useEffect(() => {
    if (exchangeRateError) {
      setError('stake', { message: 'LP stake did not load correctly' });
    }
  }, [setError, exchangeRateError]);

  React.useEffect(() => {
    if (stake && exchangeRate && stakeFocused && !tokensFocused) {
      setValue(
        'tokens',
        formatCustom(exchangeRate.tokenRate(window.BigInt(parseAssets(stake)))),
        { shouldValidate: true },
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stake, exchangeRate]);

  React.useEffect(() => {
    if (tokens && exchangeRate && tokensFocused && !stakeFocused) {
      setValue(
        'stake',
        formatCustom(exchangeRate.ethRate(window.BigInt(parseAssets(tokens)))),
        { shouldValidate: true },
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, exchangeRate]);

  if (exchangeRateLoading) {
    return <div className={styles.form}>Loading...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      <label className={styles.wrapper} htmlFor="stake">
        Stake your ETH through Uniswap (balance:
        {' '}
        {formattedBalance}
        )
        <div className={styles.inputWrapper}>
          <TextInput
            register={register}
            id="stake"
            name="stake"
            errorTitle="Stake"
            onFocus={() => setStakeFocused(true)}
            onBlur={() => setStakeFocused(false)}
            value={stake}
            className={styles.input}
            onChange={(event) => setValue('stake', event.target.value)}
            validate={(input) => (!input || /^\d*\.?\d+$/.test(input) ? undefined : 'Invalid stake')}
            disabled={isSubmitting}
            placeholder="ETH"
            required
          />
        </div>
        {errors.stake && (
        <div className={styles.error}>
          {errors.stake.message}
        </div>
        )}
        {isSubmitSuccessful && (
          <div className={styles.success}>
            LP staked:
            {' '}
            {formatCustom(results)}
          </div>
        )}
      </label>
      <label className={styles.wrapper} htmlFor="tokens">
        Stake your LLD through Uniswap (balance:
        {' '}
        {lldBalance}
        )
        <div className={styles.inputWrapper}>
          <TextInput
            register={register}
            id="tokens"
            name="tokens"
            errorTitle="Tokens"
            onFocus={() => setTokensFocused(true)}
            onBlur={() => setTokensFocused(false)}
            value={tokens}
            className={styles.input}
            onChange={(event) => setValue('tokens', event.target.value)}
            validate={(input) => (!input || /^\d*\.?\d+$/.test(input) ? undefined : 'Invalid tokens')}
            disabled={isSubmitting}
            placeholder="LLD"
            required
          />
        </div>
        {errors.tokens && (
          <div className={styles.error}>
            {errors.tokens.message}
          </div>
        )}
      </label>
      <label className={styles.wrapper} htmlFor="tolerance">
        Contract will fail if cannot stake
        {' '}
        {tolerance}
        % of ETH/LLD into LP
        <ProgressBar
          value={parseInt(tolerance)}
          handleChange={(event) => setValue('tolerance', event.target.value.toString())}
          register={register}
          name="tolerance"
        />
        {errors.tolerance && (
          <div className={styles.error}>
            {errors.tolerance.message}
          </div>
        )}
      </label>
      <div className={styles.reward}>
        {liquidityPoolReward}
      </div>
      <div className={styles.reward}>
        Will ask you to sign 4 transactions.
        Close the form after and click on refresh after to see all current information.
      </div>
      <div className={styles.buttonRow}>
        <div className={styles.closeForm}>
          <Button disabled={isSubmitting} medium onClick={onClose}>
            Close
          </Button>
        </div>
        <div>
          <Button
            primary
            medium
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading...' : 'Stake ETH & LLD'}
          </Button>
        </div>
      </div>
    </form>
  );
}

StakeEthForm.propTypes = {
  account: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

function StakeEthFormModalWrapper(props) {
  const [show, setShow] = React.useState();
  return (
    <div className={styles.modal}>
      <Button primary medium onClick={() => setShow(true)}>
        Stake ETH & LLD
      </Button>
      {show && (
        <ModalRoot>
          <StakeEthForm {...props} onClose={() => setShow(false)} />
        </ModalRoot>
      )}
    </div>
  );
}

export default StakeEthFormModalWrapper;
