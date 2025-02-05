import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import InputNumber from 'antd/es/input-number';
import Checkbox from 'antd/es/checkbox/Checkbox';
import { BN } from '@polkadot/util';
import { SwapOutlined } from '@ant-design/icons';
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

function TradeTokensFormWrapper({ onClose, assets: initialAssets }) {
  const dispatch = useDispatch();
  const reserves = useSelector(dexSelectors.selectorReserves);
  const [assets, setAssets] = useState(initialAssets);
  const {
    asset1,
    asset2,
    assetData1,
    assetData2,
  } = assets;
  const decimals1 = useMemo(() => getDecimalsForAsset(asset1, assetData1?.decimals), [asset1, assetData1?.decimals]);
  const decimals2 = useMemo(() => getDecimalsForAsset(asset2, assetData2?.decimals), [asset2, assetData2?.decimals]);

  const reservesThisAssets = useMemo(() => {
    if (reserves && asset1 && asset2 && reserves?.[asset1]?.[asset2]) {
      const asset1Value = reserves[asset1][asset2].asset1;
      const asset2Value = reserves[asset1][asset2].asset2;
      return { ...reserves[asset1][asset2], asset1: asset1Value, asset2: asset2Value };
    }
    return null;
  }, [asset1, asset2, reserves]);

  const handleSwap = useCallback(() => {
    setAssets((prev) => ({
      asset1: prev.asset2,
      asset2: prev.asset1,
      assetData1: prev.assetData2,
      assetData2: prev.assetData1,
      asset1ToShow: prev.asset2ToShow,
      asset2ToShow: prev.asset1ToShow,
    }));
  }, []);

  useEffect(() => {
    dispatch(dexActions.getDexReserves.call({ asset1, asset2 }));
  }, [dispatch, asset1, asset2]);

  useEffect(() => {
    dispatch(walletActions.getAssetsBalance.call([asset1, asset2]));
  }, [dispatch, asset1, asset2]);

  return (
    <TradeTokensForm
      assets={assets}
      handleSwap={handleSwap}
      decimals1={decimals1}
      decimals2={decimals2}
      onClose={onClose}
      reservesThisAssets={reservesThisAssets}
    />
  );
}

TradeTokensFormWrapper.propTypes = {
  onClose: PropTypes.func.isRequired,
  assets: AssetsPropTypes.isRequired,
};

function TradeTokensForm({
  onClose, assets, decimals1, decimals2, handleSwap, reservesThisAssets,
}) {
  const [isBuy, setIsBuy] = useState(true);
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const assetsBalance = useSelector(walletSelectors.selectorAssetsBalance);

  const [isAsset1State, setIsAsset1State] = useState(false);
  const [formatedValue, setFormatedValue] = useState({});

  const {
    asset1,
    asset2,
    asset1ToShow,
    asset2ToShow,
  } = assets;

  const [loading, setLoading] = useState();
  const [amount1Focused, setAmount1Focused] = useState();
  const [amount2Focused, setAmount2Focused] = useState();
  const [form] = Form.useForm();
  const details = Form.useWatch('details', form);
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
      const path = [asset2, asset1];
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

  const amount1In = Form.useWatch('amount1In', form);
  const handleInputBuy = useCallback(async (value) => {
    try {
      setIsAsset1State(true);
      const { enum1, enum2 } = convertToEnumDex(asset2, asset1);
      const tradeData = await getSwapPriceTokensForExactTokens(enum1, enum2, parseAssets(value, decimals1));
      const showReserve = formatAssets(
        reservesThisAssets.asset2,
        decimals2,
        { symbol: asset2ToShow, withAll: true },
      );

      const formatedValueData = tradeData ? formatAssets(
        tradeData,
        decimals2,
      ) : '';

      const sanitizedValue = sanitizeValue(formatedValueData);
      form.setFieldValue('amountIn2', sanitizedValue);

      form.validateFields();

      if (!tradeData) {
        const msg = `No trade data from api for ${asset1}`;
        form.setFields([{
          name: 'amountIn2',
          errors: [msg],
        }]);
        setFormatedValue({ [asset1]: { value: tradeData, msg } });
      }

      const priceBN = new BN(tradeData);

      if (priceBN.gte(new BN(reservesThisAssets.asset2))) {
        const msg = `Input value exceeds reserves max ${showReserve}`;
        form.setFields([{
          name: 'amountIn2',
          errors: [msg],
        }]);
        setFormatedValue({ [asset1]: { value: tradeData, msg } });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching API data:', err);
    }
  }, [asset1, asset2, reservesThisAssets, decimals1, decimals2, asset2ToShow, form]);

  const amount2In = Form.useWatch('amountIn2', form);
  const handleInputSell = useCallback(async (value) => {
    setIsAsset1State(false);
    try {
      const { enum1, enum2 } = convertToEnumDex(asset1, asset2);
      const tradeData = await getSwapPriceExactTokensForTokens(enum1, enum2, parseAssets(value, decimals1));
      const showReserve = formatAssets(
        reservesThisAssets.asset1,
        decimals1,
        { symbol: asset1ToShow, withAll: true },
      );

      const formatedValueData = tradeData ? formatAssets(
        tradeData,
        decimals1,
      ) : '';

      const sanitizedValue = sanitizeValue(formatedValueData);
      form.setFieldValue('amount1In', sanitizedValue);

      form.validateFields();

      if (!tradeData) {
        const msg = `No trade data from api for ${asset2}`;
        form.setFields([{
          name: 'amount1In',
          errors: [msg],
        }]);
        setFormatedValue({ [asset2]: { value: tradeData, msg } });
      }

      const priceBN = new BN(tradeData);

      if (priceBN.gte(new BN(reservesThisAssets.asset1))) {
        const msg = `Input value exceeds reserves max ${showReserve}`;
        form.setFields([{
          name: 'amount1In',
          errors: [msg],
        }]);
        setFormatedValue({ [asset2]: { value: tradeData, msg } });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching API data:', err);
    }
  }, [asset1, asset2, reservesThisAssets, decimals1, asset1ToShow, form]);

  const validate = (v, assetBalance, decimals, asset) => {
    if (!v) {
      return 'Required';
    }
    if (Number.isNaN(Number(v))) {
      return 'Not a valid number';
    }
    const isAsset1 = asset1 !== asset;

    if ((v.split('.')[1]?.length || 0) > decimals) {
      return `${isAsset1 ? asset2ToShow : asset1ToShow} don't have this amount of decimals`;
    }
    const tradeValue = formatedValue[asset];
    if (tradeValue) {
      const { msg, value: valueData } = tradeValue;
      const priceBN = new BN(valueData);
      const reserve = reservesThisAssets[isBuy ? 'asset1' : 'asset2'];

      if (priceBN.gte(new BN(reserve.toString()))) {
        return msg;
      }
    }

    if (isBuy ? asset !== asset1 : asset === asset1) {
      const inputBN = parseAssets(v, decimals);
      const assetBN = new BN(assetBalance.toString());
      if (inputBN.gt(assetBN)) {
        return 'Input greater than balance';
      }
    }
    return undefined;
  };

  useEffect(() => {
    if (amount1In && amount1Focused) {
      setIsBuy(true);
      handleInputBuy(amount1In);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount1In]);

  useEffect(() => {
    if (amount2In && amount2Focused) {
      setIsBuy(false);
      handleInputSell(amount2In);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount2In]);

  const submitText = isStock ? 'Trade stock' : 'Exchange tokens';

  const symbolHelper = (symbol, size) => (
    <Flex wrap gap="5px" align="center">
      {symbol}
      <CurrencyIcon size={size} symbol={symbol} />
    </Flex>
  );

  return (
    <Form
      className={styles.getCitizenshipModal}
      onFinish={onSubmit}
      form={form}
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
              Buy
            </div>
            {symbolHelper(asset1ToShow, 20)}
          </Flex>
        )}
        extra={(
          <>
            Balance
            {' '}
            {(assetsBalance && assetsBalance.length > 0)
              ? formatAssets(
                assetsBalance[0],
                decimals1,
                { symbol: asset1ToShow, withAll: true },
              ) : 0}
          </>
        )}
        rules={[
          { required: true },
        ]}
      >
        <InputNumber
          stringMode
          controls={false}
          onFocus={() => setAmount1Focused(true)}
          onBlur={() => setAmount1Focused(false)}
        />
      </Form.Item>
      <div
        className={styles.swapButton}
        onClick={() => {
          setIsBuy(false);
          setIsAsset1State(false);
          handleSwap();
          form.setFieldValue('amountIn2', '');
        }}
      >
        <div className={styles.circle}>
          <SwapOutlined className={styles.swapIcon} />
        </div>
      </div>
      <Form.Item
        name="amountIn2"
        label={(
          <Flex wrap gap="10px">
            <div>
              Sell
            </div>
            {symbolHelper(asset2ToShow, 20)}
          </Flex>
        )}
        extra={(
          <>
            Balance
            {' '}
            {assetsBalance && assetsBalance.length > 0 ? formatAssets(
              assetsBalance[1],
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
                const validated = validate(v, assetsBalance[1], decimals2, asset1);
                if (validated) {
                  return Promise.reject(validated);
                }
              }
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
        />
      </Form.Item>
      {details && (
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
      )}
      <Form.Item
        label="Additional Settings"
        name="details"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Flex gap="15px" wrap>
        <Button medium onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button primary medium type="submit" disabled={loading}>
          {loading ? 'Loading...' : submitText}
        </Button>
      </Flex>
    </Form>
  );
}

TradeTokensForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  assets: AssetsPropTypes.isRequired,
  decimals1: PropTypes.number.isRequired,
  decimals2: PropTypes.number.isRequired,
  handleSwap: PropTypes.func.isRequired,
  reservesThisAssets: PropTypes.shape({
    asset1: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    asset2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

function ButtonModal(props) {
  return (
    <OpenModalButton text="Swap" primary {...props} />
  );
}

const TradeTokensModal = modalWrapper(TradeTokensFormWrapper, ButtonModal);

export default TradeTokensModal;
