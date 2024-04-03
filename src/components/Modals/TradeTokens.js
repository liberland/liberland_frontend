import React, { useEffect, useMemo, useState } from 'react';
import PropsTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import cx from 'classnames';
import _ from 'lodash';
import { BN } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import styles from './styles.module.scss';
import Button from '../Button/Button';
import { dexActions, walletActions } from '../../redux/actions';
import { userSelectors, dexSelectors, walletSelectors } from '../../redux/selectors';
import {
  calculateAmountDesiredFormatted,
  converTransferData,
  convertToEnumDex,
  formatProperlyValue,
  formatterDecimals,
  getBNDataToFindPrice,
  getDecimalsBN,
  getDecimalsForAsset,
} from '../../utils/dexFormater';
import { AssetsPropTypes } from '../Wallet/Exchange/proptypes';
import { getSwapPriceExactTokensForTokens, getSwapPriceTokensForExactTokens } from '../../api/nodeRpcCall';

function TradeTokensModal({
  handleModal, assets, isBuy,
}) {
  const dispatch = useDispatch();
  const walletAddress = useSelector(userSelectors.selectWalletAddress);
  const assetBalance = useSelector(walletSelectors.selectorAssetBalance);
  const reserves = useSelector(dexSelectors.selectorReserves);
  const [isChecked, setIsChecked] = useState(false);
  const isDisplayNone = isChecked ? null : styles.displayNone;
  const [searchAmount, setSearchAmount] = useState('');
  const [actualPrice, setActualPrice] = useState(null);

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
    if (reserves && asset1 && asset2 && reserves[asset1 + asset2]) {
      const indexAsset = asset1 + asset2;
      const asset1Value = Number(reserves[indexAsset].asset1);
      const asset2Value = Number(reserves[indexAsset].asset2);
      return { ...reserves[indexAsset], asset1: asset1Value, asset2: asset2Value };
    }
    return null;
  }, [asset1, asset2, reserves]);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      cos: null,
    },
  });

  const onSubmit = async (data) => {
    if (!isValid) return;
    const { amountIn, amountOutMin } = data;
    const amountOut = amountOutMin.length > 0 ? amountOutMin : undefined;
    try {
      const { amount, amountMin } = await converTransferData(
        asset1,
        decimals1,
        asset2,
        decimals2,
        amountIn,
        amountOut,
        isBuy,
        reservesThisAssets,
      );
      const swapData = {
        path: { asset1, asset2 },
        amount,
        amountMin,
        sendTo: walletAddress,
      };
      dispatch(
        isBuy
          ? dexActions.swapTokensForExactTokens.call(swapData) : dexActions.swapExactTokensForTokens.call(swapData),
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }

    handleModal();
  };

  const debouncedSearch = (searchTerm) => new Promise((resolve, reject) => {
    _.debounce(async () => {
      try {
        const asset = isBuy ? asset2 : asset1;
        const decimalsNumber = isBuy ? decimals2 : decimals1;
        const amount = getBNDataToFindPrice(asset, decimalsNumber, searchTerm);
        const { enum1, enum2 } = convertToEnumDex(asset1, asset2);
        const tradeData = isBuy ? await getSwapPriceTokensForExactTokens(enum1, enum2, amount, true)
          : await getSwapPriceExactTokensForTokens(enum1, enum2, amount, true);
        setActualPrice(tradeData?.toString() || 0);
        resolve(tradeData?.toString() || 0);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching API data:', err);
        setActualPrice(null);
        reject(err);
      }
    }, 500)(searchTerm);
  });

  const handleInputChange = (event) => {
    const term = event.target.value;
    setSearchAmount(term);
  };

  const validate = async (v) => {
    if (Number.isNaN(Number(v))) {
      return 'Not a valid number';
    }
    const price = await debouncedSearch(v);
    const decimalsBN = getDecimalsBN(
      isBuy ? asset2 : asset1,
      isBuy ? assetData2?.decimals : assetData1?.decimals,
    );
    const inputBN = calculateAmountDesiredFormatted(v, decimalsBN);
    const assetBN = new BN(assetBalance);
    if (inputBN.gt(assetBN)) {
      return 'Input greater than balance';
    }

    if (isBuy) {
      const priceBN = new BN(price);
      if (priceBN.isZero() || priceBN.gte(new BN(reservesThisAssets.asset1))) {
        return 'Input value exceeds reserves';
      }
    }
    return true;
  };

  useEffect(() => {
    dispatch(dexActions.getDexReserves.call({ asset1, asset2 }));
  }, [dispatch, asset1, asset2]);

  useEffect(() => {
    dispatch(walletActions.getAssetBalance.call(isBuy ? asset2 : asset1));
  }, [dispatch, isBuy, asset1, asset2]);

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
          {assetBalance ? formatProperlyValue(
            isBuy ? asset2 : asset1,
            assetBalance,
            isBuy ? asset2ToShow : asset1ToShow,
            isBuy ? decimals2 : decimals1,
          ) : 0}
        </span>
      </div>
      {(actualPrice && actualPrice !== 0) ? (
        <div>
          You will earn
          {' '}
          {formatterDecimals(new BN(actualPrice), isBuy ? decimals1 : decimals2)}
          {' '}
          {isBuy ? asset1ToShow : asset2ToShow}
        </div>
      ) : null}
      <TextInput
        required
        value={searchAmount}
        onChange={handleInputChange}
        validate={async (v) => validate(v)}
        errorTitle="Amount In"
        register={register}
        name="amountIn"
      />
      {errors?.amountIn && (
        <div className={styles.error}>{errors.amountIn.message}</div>
      )}
      <div className={cx(styles.title, isDisplayNone)}>
        Amount Out Min (
        {!isBuy ? asset2ToShow : asset1ToShow}
        )
      </div>
      <TextInput
        className={cx(isDisplayNone)}
        validate={(v) => (!v ? true : !Number.isNaN(parseInt(v)) || 'Not a valid number')}
        errorTitle="Amount Out Min"
        register={register}
        name="amountOutMin"
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
        <Button medium onClick={handleModal}>
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
  handleModal: PropsTypes.func.isRequired,
  assets: AssetsPropTypes.isRequired,
  isBuy: PropsTypes.bool.isRequired,
};

function TradeTokensModalWrapper(props) {
  return (
    <ModalRoot>
      <TradeTokensModal {...props} />
    </ModalRoot>
  );
}

export default TradeTokensModalWrapper;
