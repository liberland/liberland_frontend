import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import cx from 'classnames';
import { BN } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import styles from './styles.module.scss';
import Button from '../Button/Button';
import { dexActions, walletActions } from '../../redux/actions';
import { dexSelectors, walletSelectors, blockchainSelectors } from '../../redux/selectors';
import PlusIcon from '../../assets/icons/plus-dark.svg';
import {
  convertTransferData,
  convertToEnumDex,
  getDecimalsForAsset,
} from '../../utils/dexFormatter';
import { AssetsPropTypes } from '../Wallet/Exchange/proptypes';
import { getSwapPriceExactTokensForTokens, getSwapPriceTokensForExactTokens } from '../../api/nodeRpcCall';
import { formatAssets, parseAssets, sanitizeValue } from '../../utils/walletHelpers';

function TradeTokensModal({
  closeModal, assets, isBuy,
}) {
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const assetsBalance = useSelector(walletSelectors.selectorAssetsBalance);
  const reserves = useSelector(dexSelectors.selectorReserves);
  const [isChecked, setIsChecked] = useState(false);
  const [isAsset1State, setIsAsset1State] = useState(false);
  const isDisplayNone = isChecked ? null : styles.displayNone;
  const [formatedValue, setFormatedValue] = useState({});

  const {
    asset1,
    asset2,
    assetData1,
    assetData2,
    asset1ToShow,
    asset2ToShow,
  } = assets;
  const decimals1 = getDecimalsForAsset(asset1, assetData1?.decimals);
  const decimals2 = getDecimalsForAsset(asset2, assetData2?.decimals);

  const reservesThisAssets = useMemo(() => {
    if (reserves && asset1 && asset2 && reserves[asset1][asset2]) {
      const asset1Value = reserves[asset1][asset2].asset1;
      const asset2Value = reserves[asset1][asset2].asset2;
      return { ...reserves[asset1][asset2], asset1: asset1Value, asset2: asset2Value };
    }
    return null;
  }, [asset1, asset2, reserves]);

  const {
    handleSubmit,
    register,
    setValue,
    trigger,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    // reValidateMode: 'onChange',
    defaultValues: {
      amountIn1: '',
      amountIn2: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const { amountIn1, amountIn2, minAmountPercent } = data;
      const amountOut = minAmountPercent.length > 0 ? minAmountPercent : undefined;
      const { amount, amountMin } = await convertTransferData(
        asset1,
        decimals1,
        asset2,
        decimals2,
        amountIn1,
        amountIn2,
        isBuy,
        amountOut,
        isAsset1State,
      );

      const path = isBuy ? [asset2, asset1] : [asset1, asset2];

      const swapData = {
        path,
        amount,
        amountMin,
        sendTo: walletAddress,
        dexReservePair: { asset1, asset2 },
      };

      if (!isBuy) {
        dispatch(isAsset1State
          ? dexActions.swapExactTokensForTokens.call(swapData)
          : dexActions.swapTokensForExactTokens.call(swapData));
      } else {
        dispatch(isAsset1State
          ? dexActions.swapExactTokensForTokens.call(swapData)
          : dexActions.swapTokensForExactTokens.call(swapData));
      }

      closeModal();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const handleInputChange = async (event, asset) => {
    const term = event?.target?.value;
    try {
      setFormatedValue({});
      const isAsset1 = asset1 === asset;
      if (!term || term === 0
        || (term.split('.')[1]?.length || 0) > (isAsset1 ? decimals2 : decimals1)) {
        return;
      }
      const { enum1, enum2 } = convertToEnumDex(asset1, asset2);
      setIsAsset1State(isAsset1);
      let tradeData = null;
      let amount = null;
      let decimalsOut = null;
      let showReserve = null;
      let reserve = null;

      if (!isBuy) {
        amount = parseAssets(term, isAsset1 ? decimals1 : decimals2);
        const getSwapPrice = isAsset1 ? getSwapPriceExactTokensForTokens : getSwapPriceTokensForExactTokens;
        tradeData = await getSwapPrice(enum1, enum2, amount);
        decimalsOut = isAsset1 ? decimals2 : decimals1;
        showReserve = formatAssets(
          reservesThisAssets[isAsset1 ? 'asset2' : 'asset1'],
          decimalsOut,
          { symbol: isAsset1 ? asset2ToShow : asset1ToShow, withAll: true },
        );
        reserve = reservesThisAssets[isAsset1 ? 'asset2' : 'asset1'];
      } else {
        amount = parseAssets(term, isAsset1 ? decimals2 : decimals1);
        const getSwapPrice = isAsset1 ? getSwapPriceTokensForExactTokens : getSwapPriceExactTokensForTokens;
        tradeData = await getSwapPrice(enum1, enum2, amount);
        decimalsOut = isAsset1 ? decimals1 : decimals2;
        showReserve = formatAssets(
          reservesThisAssets[isBuy ? 'asset1' : 'asset2'],
          decimalsOut,
          { symbol: isAsset1 ? asset1ToShow : asset2ToShow, withAll: true },
        );
        reserve = reservesThisAssets[isBuy ? 'asset1' : 'asset2'];
      }

      const formatedValueData = tradeData ? formatAssets(
        tradeData,
        decimalsOut,
      ) : '';
      const sanitizedValue = sanitizeValue(formatedValueData);
      setValue('amountIn1', isAsset1 ? term : sanitizedValue);
      setValue('amountIn2', isAsset1 ? sanitizedValue : term);
      await trigger();

      if (!tradeData) {
        const msg = `No trade data from api for ${asset}`;
        setError(
          !isAsset1 ? 'amountIn1' : 'amountIn2',
          { type: 'custom', message: msg },
        );
        setFormatedValue({ [asset]: { value: tradeData, msg } });
      }

      const priceBN = new BN(tradeData);

      if (priceBN.gte(new BN(reserve.toString()))) {
        const msg = `Input value exceeds reserves max ${showReserve}`;
        setError(
          !isAsset1 ? 'amountIn1' : 'amountIn2',
          { type: 'custom', message: msg },
        );
        setFormatedValue({ [asset]: { value: tradeData, msg } });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching API data:', err);
    }
  };

  const validate = async (v, assetBalance, decimals, asset) => {
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
    return true;
  };

  useEffect(() => {
    dispatch(dexActions.getDexReserves.call({ asset1, asset2 }));
  }, [dispatch, asset1, asset2]);

  useEffect(() => {
    dispatch(walletActions.getAssetsBalance.call([asset1, asset2]));
  }, [dispatch, asset1, asset2]);

  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className={styles.h3}>
        {isBuy ? 'BUY' : 'SELL'}
        {' '}
        {asset1ToShow}
        {' '}
        FOR
        {' '}
        {asset2ToShow}
      </h3>

      <div className={cx(styles.title, styles.titleFlex)}>
        <span>
          Amount In (
          {isBuy ? asset2ToShow : asset1ToShow}
          )
        </span>
        <span>
          Balance
          {' '}
          {(assetsBalance && assetsBalance.length > 0)
            ? formatAssets(
              isBuy ? assetsBalance[1] : assetsBalance[0],
              isBuy ? decimals2 : decimals1,
              { symbol: isBuy ? asset2ToShow : asset1ToShow, withAll: true },
            ) : 0}
        </span>
      </div>
      <TextInput
        required
        onChange={(v) => handleInputChange(v, asset1)}
        validate={(v) => (isBuy
          ? validate(v, assetsBalance[1], decimals2, asset2)
          : validate(v, assetsBalance[0], decimals1, asset1))}
        errorTitle={`Amount In ${asset1ToShow}`}
        register={register}
        name="amountIn1"
      />
      {errors?.amountIn1 && (
        <div className={styles.error}>{errors.amountIn1.message}</div>
      )}
      <div className={cx(styles.title, styles.titleFlex)}>
        <span>
          Amount Out (
          {!isBuy ? asset2ToShow : asset1ToShow}
          )
        </span>
        <span>
          Balance
          {' '}
          {assetsBalance && assetsBalance.length > 0 ? formatAssets(
            isBuy ? assetsBalance[0] : assetsBalance[1],
            isBuy ? decimals1 : decimals2,
            { symbol: isBuy ? asset1ToShow : asset2ToShow, withAll: true },
          ) : 0}
        </span>
      </div>
      <TextInput
        required
        onChange={(v) => handleInputChange(v, asset2)}
        validate={(v) => (!isBuy
          ? validate(v, assetsBalance[1], decimals2, asset2)
          : validate(v, assetsBalance[0], decimals1, asset1))}
        errorTitle={`Amount In 2 ${asset2ToShow}`}
        register={register}
        name="amountIn2"
      />
      {errors?.amountIn2 && (
        <div className={styles.error}>{errors.amountIn2.message}</div>
      )}
      <div className={cx(styles.title, isDisplayNone)}>
        Max Slippage (in percent %)
      </div>
      <TextInput
        className={cx(isDisplayNone)}
        validate={(v) => (!v ? true : !Number.isNaN(parseInt(v)) || 'Not a valid number')}
        errorTitle="Amount Percent"
        register={register}
        name="minAmountPercent"
        placeholder="Default max slippage is 0.5%"
      />
      {errors?.amountOutMin && (
        <div className={cx(styles.error, isDisplayNone)}>{errors.amountOutMin.message}</div>
      )}
      <div className={styles.checkbox}>
        <label>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked((prevValue) => !prevValue)}
          />
          Additional Settings
        </label>
      </div>

      <div className={styles.buttonWrapper}>
        <Button medium onClick={closeModal}>
          Cancel
        </Button>
        <Button primary medium type="submit">
          Exchange Tokens
        </Button>
      </div>
    </form>
  );
}

TradeTokensModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  assets: AssetsPropTypes.isRequired,
  isBuy: PropTypes.bool,
};

function TradeTokensModalWrapper({
  assets,
  isBuy,
  asset1ToShow,
  asset2ToShow,
}) {
  const [show, setShow] = React.useState(false);
  return (
    <>
      <Button
        primary
        onClick={() => {
          setShow(true);
        }}
      >
        {isBuy ? 'Buy' : 'Sell'}
        {' '}
        {asset1ToShow}
        {' for '}
        {asset2ToShow}
        <img src={PlusIcon} className={cx(styles.backIcon, styles.darken)} alt="button icon" />
      </Button>
      {show && (
        <ModalRoot>
          <TradeTokensModal assets={assets} closeModal={() => setShow(false)} isBuy={isBuy} />
        </ModalRoot>
      )}
    </>
  );
}

TradeTokensModalWrapper.propTypes = {
  assets: AssetsPropTypes.isRequired,
  isBuy: PropTypes.bool,
  asset1ToShow: PropTypes.string.isRequired,
  asset2ToShow: PropTypes.string.isRequired,
};

export default TradeTokensModalWrapper;
