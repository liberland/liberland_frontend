import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import InputNumber from 'antd/es/input-number';
import Collapse from 'antd/es/collapse';
import { BN } from '@polkadot/util';
import SwapOutlined from '@ant-design/icons/SwapOutlined';
import styles from './styles.module.scss';
import Button from '../Button/Button';
import { dexActions, walletActions } from '../../redux/actions';
import { dexSelectors, walletSelectors, blockchainSelectors } from '../../redux/selectors';
import {
  convertTransferData,
  convertToEnumDex,
  getDecimalsForAsset,
} from '../../utils/dexFormatter';
import { AssetsPropTypes } from '../Wallet/Exchange/proptypes';
import { getSwapPriceExactTokensForTokens, getSwapPriceTokensForExactTokens } from '../../api/nodeRpcCall';
import { formatAssets, parseAssets, sanitizeValue } from '../../utils/walletHelpers';
import { useStockContext } from '../Wallet/StockContext';
import CurrencyIcon from '../CurrencyIcon';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function TradeTokensForm({
  onClose, assets: initialAssets,
}) {
  const [isBuy, setIsBuy] = useState(false);
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const assetsBalance = useSelector(walletSelectors.selectorAssetsBalance);
  const reserves = useSelector(dexSelectors.selectorReserves);
  const [assets, setAssets] = useState(initialAssets);
  const [input1Error, setInput1Error] = useState(null);
  const [input2Error, setInput2Error] = useState(null);
  const [isAsset1State, setIsAsset1State] = useState(false);
  const {
    asset1,
    asset2,
    asset1ToShow,
    asset2ToShow,
    assetData1,
    assetData2,
  } = assets;

  const reservesThisAssets = useMemo(() => {
    if (!(reserves && asset1 && asset2)) return null;

    const getReserves = (primary, secondary) => {
      const reserve = reserves?.[primary]?.[secondary];
      if (!reserve) return null;
      return {
        ...reserve,
        [primary]: reserve.asset1,
        [secondary]: reserve.asset2,
      };
    };

    return getReserves(asset1, asset2) || getReserves(asset2, asset1);
  }, [asset1, asset2, reserves]);

  const decimals1 = useMemo(() => getDecimalsForAsset(asset1, assetData1?.decimals), [asset1, assetData1?.decimals]);
  const decimals2 = useMemo(() => getDecimalsForAsset(asset2, assetData2?.decimals), [asset2, assetData2?.decimals]);

  const [loading, setLoading] = useState();
  const [amount1Focused, setAmount1Focused] = useState();
  const [amount2Focused, setAmount2Focused] = useState();
  const [form] = Form.useForm();
  const { isStock } = useStockContext();

  const onSubmit = async ({
    amount1In, amountIn2, minAmountPercent,
  }) => {
    setLoading(true);
    try {
      const { amount, amountMin } = await convertTransferData(
        asset1,
        decimals1,
        asset2,
        decimals2,
        amount1In,
        amountIn2,
        isBuy,
        minAmountPercent,
        isAsset1State,
      );
      const path = [asset1, asset2];
      const swapData = {
        path,
        amount,
        amountMin,
        sendTo: walletAddress,
        dexReservePair: { asset1, asset2 },
      };

      dispatch(!isBuy
        ? dexActions.swapExactTokensForTokens.call(swapData)
        : dexActions.swapTokensForExactTokens.call(swapData));

      onClose();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setLoading(false);
    }
  };

  const amount2In = Form.useWatch('amountIn2', form);
  const handleInputBuy = useCallback(async (value) => {
    try {
      setIsAsset1State(false);
      setInput1Error(null);
      const { enum1, enum2 } = convertToEnumDex(asset1, asset2);
      const inputValue = parseAssets(value, decimals2);
      const tradeData = await getSwapPriceTokensForExactTokens(enum1, enum2, inputValue);
      const showReserve = formatAssets(
        reservesThisAssets[asset2],
        decimals2,
        { symbol: asset2ToShow, withAll: true },
      );
      if (inputValue.gte(new BN(reservesThisAssets[asset2]))) {
        const msg = `Input value exceeds reserves max ${showReserve}`;
        setInput2Error(msg);
        return;
      }

      const formatedValueData = tradeData ? formatAssets(
        tradeData,
        decimals1,
      ) : '';

      const sanitizedValue = sanitizeValue(formatedValueData);
      form.setFieldValue('amount1In', sanitizedValue);
      form.validateFields();

      if (!tradeData) {
        const msg = `No trade data from api for ${asset1}`;
        setInput1Error(msg);
        return;
      }

      const priceBN = new BN(tradeData);
      const assetBN = new BN(assetsBalance[asset1]);

      if (priceBN.gt(assetBN)) {
        const msg = 'Input greater than balance';
        setInput1Error(msg);
        return;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching API data:', err);
    }
  }, [asset1, asset2, decimals2, reservesThisAssets, decimals1, asset2ToShow, form, assetsBalance]);

  const amount1In = Form.useWatch('amount1In', form);
  const handleInputSell = useCallback(async (value) => {
    try {
      setIsAsset1State(true);
      setInput2Error(null);
      const assetBN = new BN(assetsBalance[asset1]);
      const inputValue = parseAssets(value, decimals1);

      if (amount1Focused && inputValue.gt(assetBN)) {
        const msg = 'Input greater than balance';
        setInput1Error(msg);
        return;
      }
      const { enum1, enum2 } = convertToEnumDex(asset1, asset2);
      const tradeData = await getSwapPriceExactTokensForTokens(enum1, enum2, inputValue);

      const formatedValueData = tradeData ? formatAssets(
        tradeData,
        decimals2,
      ) : '';

      const sanitizedValue = sanitizeValue(formatedValueData);
      form.setFieldValue('amountIn2', sanitizedValue);

      form.validateFields();

      if (!tradeData) {
        const msg = `No trade data from api for ${asset1}`;
        setInput2Error(msg);
        return;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching API data:', err);
    }
  }, [assetsBalance, asset1, decimals1, decimals2, amount1Focused, asset2, form]);

  const validate = (v, assetToShow, decimals) => {
    if (!v) {
      return 'Required';
    }
    if (Number.isNaN(Number(v))) {
      return 'Not a valid number';
    }

    if ((v.split('.')[1]?.length || 0) > decimals) {
      return `${assetToShow} don't have this amount of decimals`;
    }

    return undefined;
  };

  const submitText = isStock ? 'Trade stock' : 'Exchange tokens';

  const symbolHelper = (symbol, size) => (
    <Flex wrap gap="5px" align="center">
      {symbol}
      <CurrencyIcon size={size} symbol={symbol} />
    </Flex>
  );

  const handleSwap = () => {
    setIsBuy((prev) => !prev);
    const newAsset = {
      asset1: asset2,
      asset2: asset1,
      assetData1: assetData2,
      assetData2: assetData1,
      asset1ToShow: asset2ToShow,
      asset2ToShow: asset1ToShow,
    };
    setAssets(newAsset);
    setInput1Error(null);
    setInput2Error(null);
  };

  useEffect(() => {
    if (input1Error) {
      form.setFields([
        {
          name: 'amount1In',
          errors: [input1Error],
        },
      ]);
    } else {
      form.setFields([
        {
          name: 'amount1In',
          errors: [],
        },
      ]);
    }
  }, [input1Error, form]);

  useEffect(() => {
    if (input2Error) {
      form.setFields([
        {
          name: 'amountIn2',
          errors: [input2Error],
        },
      ]);
    } else {
      form.setFields([
        {
          name: 'amountIn2',
          errors: [],
        },
      ]);
    }
  }, [input2Error, form]);

  useEffect(() => {
    if (amount1In && amount1Focused) {
      setIsBuy(false);
      handleInputSell(amount1In);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount1In]);

  useEffect(() => {
    if (amount2In && amount2Focused) {
      setIsBuy(true);
      handleInputBuy(amount2In);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount2In]);

  useEffect(() => {
    dispatch(dexActions.getDexReserves.call({ asset1, asset2 }));
  }, [dispatch, asset1, asset2]);

  useEffect(() => {
    dispatch(walletActions.getAssetsBalance.call([asset1, asset2]));
  }, [dispatch, asset1, asset2]);

  useEffect(() => {
    if (isBuy) {
      const value = form.getFieldValue('amount1In');
      form.setFieldValue('amountIn2', value);
      handleInputBuy(value);
    } else {
      const value = form.getFieldValue('amountIn2');
      form.setFieldValue('amount1In', value);
      handleInputSell(value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets]);

  return (
    <Form
      className={styles.getCitizenshipModal}
      onFinish={onSubmit}
      form={form}
      initialValues={{
        minAmountPercent: 10,
      }}
      layout="vertical"
    >
      <Title level={3}>
        <Flex wrap gap="10px">
          <span>
            Swap
          </span>
        </Flex>
      </Title>
      <Form.Item
        name="amount1In"
        label={(
          <Flex wrap gap="10px">
            <div>
              Sell
            </div>
            {symbolHelper(asset1ToShow, 20)}
          </Flex>
        )}
        extra={(
          <>
            Balance
            {' '}
            {assetsBalance?.[asset1] ? formatAssets(
              assetsBalance[asset1],
              decimals1,
              { symbol: asset1ToShow, withAll: true },
            ) : 0}
          </>
        )}
        rules={[
          { required: true },
          {
            validator: (_, v) => {
              if (v) {
                const validated = validate(v, asset1ToShow, decimals1);
                if (validated) {
                  return Promise.reject(validated);
                }
              }
              if (input1Error) return Promise.reject(input1Error);
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber
          stringMode
          controls={false}
          onFocus={() => setAmount1Focused(true)}
          onBlur={() => setAmount1Focused(false)}
          onChange={() => setInput1Error(null)}
        />
      </Form.Item>
      <div
        className={styles.swapButton}
      >
        <div className={styles.circle} onClick={handleSwap}>
          <SwapOutlined className={styles.swapIcon} />
        </div>
      </div>
      <Form.Item
        name="amountIn2"
        label={(
          <Flex wrap gap="10px">
            <div>
              Buy
            </div>
            {symbolHelper(asset2ToShow, 20)}
          </Flex>
        )}
        extra={(
          <>
            Balance
            {' '}
            {assetsBalance?.[asset2]
              ? formatAssets(
                assetsBalance[asset2],
                decimals2,
                { symbol: asset2ToShow, withAll: true },
              ) : 0}
          </>
        )}
        rules={[
          { required: true },
          {
            validator: (_, v) => {
              if (v) {
                const validated = validate(v, asset2ToShow, decimals2);
                if (validated) {
                  return Promise.reject(validated);
                }
              }
              if (input2Error) return Promise.reject(input2Error);
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber
          stringMode
          controls={false}
          onFocus={() => setAmount2Focused(true)}
          onBlur={() => setAmount2Focused(false)}
          onChange={() => setInput2Error(null)}
        />
      </Form.Item>
      <Flex vertical gap="20px">
        <Collapse
          items={[
            {
              key: 'details',
              label: 'Additional settings',
              children: (
                <Form.Item
                  label="Max Slippage (in percent %)"
                  name="minAmountPercent"
                  rules={[
                    { required: true },
                    { type: 'number' },
                  ]}
                >
                  <InputNumber controls={false} />
                </Form.Item>
              ),
            },
          ]}
        />
        <Flex gap="15px" wrap>
          <Button medium onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button primary medium type="submit" disabled={loading}>
            {loading ? 'Loading...' : submitText}
          </Button>
        </Flex>
      </Flex>
    </Form>
  );
}

TradeTokensForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  assets: AssetsPropTypes.isRequired,
};

function ButtonModal(props) {
  return (
    <OpenModalButton text="Swap" primary {...props} />
  );
}

const TradeTokensModal = modalWrapper(TradeTokensForm, ButtonModal);

export default TradeTokensModal;
