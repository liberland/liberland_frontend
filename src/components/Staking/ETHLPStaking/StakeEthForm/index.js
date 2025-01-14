import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import Slider from 'antd/es/slider';
import PropTypes from 'prop-types';
import ModalRoot from '../../../Modals/ModalRoot';
import { ethSelectors } from '../../../../redux/selectors';
import { ethActions } from '../../../../redux/actions';
import Button from '../../../Button/Button';
import {
  formatCustom as formatCustomUnsafe,
  parseAssets as parseAssetsUnsafe,
} from '../../../../utils/walletHelpers';
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
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const connected = useSelector(ethSelectors.selectorConnected);
  const balance = useSelector(ethSelectors.selectorBalance);

  const onSubmit = async ({ stake, tokens, tolerance }) => {
    const realStake = parseAssets(stake);
    const realTokens = parseAssets(tokens);
    const signer = await connected.provider.getSigner(account);
    const getAmountWithTolerance = (amount) => (
      ((window.BigInt(amount) * window.BigInt(tolerance)) / window.BigInt(100)).toString()
    );
    dispatch(ethActions.stakeLpWithEth.call({
      address: account,
      account: signer,
      ethAmount: realStake,
      ethAmountMin: getAmountWithTolerance(realStake),
      tokenAmount: realTokens,
      tokenAmountMin: getAmountWithTolerance(realTokens),
      provider: connected.provider,
    }));
  };

  const stake = Form.useWatch('stake', form) || '';
  const tokens = Form.useWatch('tokens', form) || '';
  const [stakeFocused, setStakeFocused] = useState(false);
  const [tokensFocused, setTokensFocused] = useState(false);
  const tolerance = Form.useWatch('tolerance', form) || '90';
  const exchangeRate = useSelector(ethSelectors.selectorWethLpExchangeRate);
  const exchangeRateLoading = useSelector(ethSelectors.selectorWethLpExchangeRateLoading);
  const exchangeRateError = useSelector(ethSelectors.selectorWethLpExchangeRateError);
  const lldBalances = useSelector(ethSelectors.selectorERC20Balance)?.[process.env.REACT_APP_THIRD_WEB_LLD_ADDRESS];

  useEffect(() => {
    dispatch(ethActions.getWethLpExchangeRate.call());
    dispatch(ethActions.getBalance.call({ provider: connected.provider, address: account }));
    dispatch(ethActions.getErc20Balance.call(
      process.env.REACT_APP_THIRD_WEB_LLD_ADDRESS,
      account,
    ));
  }, [account, dispatch, connected]);

  const lldBalance = useMemo(
    () => formatCustom(lldBalances?.[account]?.balance?.toString() || '0'),
    [account, lldBalances],
  );

  const formattedBalance = formatCustom(balance || '0');

  const liquidityPoolReward = useMemo(() => {
    if (stake && tokens && exchangeRate && !form.getFieldError('stake') && !form.getFieldError('token')) {
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
  }, [exchangeRate, stake, tokens, form]);

  useEffect(() => {
    if (exchangeRateError) {
      form.setFields([{ name: 'stake', errors: ['LP stake did not load correctly'] }]);
    }
  }, [form, exchangeRateError]);

  useEffect(() => {
    if (stake && exchangeRate && stakeFocused && !tokensFocused) {
      form.setFieldValue(
        'tokens',
        formatCustom(exchangeRate.tokenRate(window.BigInt(parseAssets(stake)))),
      );
    }
  }, [stake, exchangeRate, stakeFocused, tokensFocused, form]);

  useEffect(() => {
    if (tokens && exchangeRate && tokensFocused && !stakeFocused) {
      form.setFieldValue(
        'stake',
        formatCustom(exchangeRate.ethRate(window.BigInt(parseAssets(tokens)))),
      );
    }
  }, [tokens, exchangeRate, tokensFocused, stakeFocused, form]);

  if (exchangeRateLoading) {
    return <div className={styles.form}>Loading...</div>;
  }

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      className={styles.form}
      layout="vertical"
      initialValues={{
        tolerance: 90,
      }}
    >
      <Form.Item
        name="stake"
        label="Stake your ETH through Uniswap"
        extra={`balance: ${formattedBalance}`}
        rules={[{ required: true }]}
      >
        <InputNumber
          stringMode
          controls={false}
          onFocus={() => setStakeFocused(true)}
          onBlur={() => setStakeFocused(false)}
        />
      </Form.Item>
      <Form.Item
        name="tokens"
        label="Stake your LLD through Uniswap"
        extra={`balance: ${lldBalance}`}
        rules={[{ required: true }]}
      >
        <InputNumber
          stringMode
          controls={false}
          onFocus={() => setTokensFocused(true)}
          onBlur={() => setTokensFocused(false)}
        />
      </Form.Item>
      <Form.Item
        name="tolerance"
        label={`Contract will fail if cannot stake ${tolerance}% of ETH/LLD into LP`}
        rules={[{ required: true }]}
      >
        <Slider min={0} max={100} />
      </Form.Item>
      <Paragraph>
        {liquidityPoolReward}
      </Paragraph>
      <Paragraph>
        Will ask you to sign 4 transactions.
        Close the form after and click on refresh after to see all current information.
      </Paragraph>
      <Flex wrap gap="15px">
        <Button onClick={onClose}>
          Close
        </Button>
        <Button
          primary
          type="submit"
        >
          Stake ETH & LLD
        </Button>
      </Flex>
    </Form>
  );
}

StakeEthForm.propTypes = {
  account: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

function StakeEthFormModalWrapper(props) {
  const [show, setShow] = useState();
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
