import React, { useState, useEffect } from 'react';
import PropsTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import cx from 'classnames';
import { BN } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import styles from './styles.module.scss';
import Button from '../Button/Button';
import { dexActions, walletActions } from '../../redux/actions';
import { blockchainSelectors, walletSelectors } from '../../redux/selectors';
import {
  convertLiquidityData, convertToEnumDex, getDecimalsForAsset,
} from '../../utils/dexFormatter';
import { AssetsPropTypes } from '../Wallet/Exchange/proptypes';
import { formatAssets, parseAssets, sanitizeValue } from '../../utils/walletHelpers';
import { getSwapPriceExactTokensForTokens, getSwapPriceTokensForExactTokens } from '../../api/nodeRpcCall';

function AddLiquidityModal({
  handleModal, assets, isReservedDataEmpty,
}) {
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const assetsBalance = useSelector(walletSelectors.selectorAssetsBalance);
  const [isChecked, setIsChecked] = useState(false);

  const isDisplayNone = isChecked ? null : styles.displayNone;
  const {
    handleSubmit,
    register,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

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

  const onSubmit = async (data) => {
    const {
      amount1Desired, amount2Desired, minAmountPercent,
    } = data;

    const {
      amount1, amount2, amount1Min, amount2Min,
    } = convertLiquidityData(
      amount1Desired,
      amount2Desired,
      decimals1,
      decimals2,
      minAmountPercent,
    );
    const mintTo = walletAddress;
    dispatch(dexActions.addLiquidity.call({
      amount1Desired: amount1,
      amount1Min,
      amount2Desired: amount2,
      amount2Min,
      asset1,
      asset2,
      walletAddress,
      mintTo,
    }));
    handleModal();
  };

  const validate = (v, assetBalance, decimals, asset) => {
    const isAsset1 = asset === asset1;
    if ((v.split('.')[1]?.length || 0) > decimals) {
      return `${isAsset1 ? asset1ToShow : asset2ToShow} don't have this amount of decimals`;
    }
    const inputBN = parseAssets(v, decimals);
    if (Number.isNaN(Number(inputBN))) {
      return 'Not a valid number';
    }

    const assetBN = new BN(assetBalance);
    if (inputBN.gt(assetBN)) {
      return 'Input greater than balance';
    }
    return true;
  };
  const { enum1, enum2 } = convertToEnumDex(asset1, asset2);

  const handleChangeInput = async (e, asset) => {
    const { value } = e.target;
    const isAsset1 = asset === asset1;

    if (!value || value === 0
      || (value.split('.')[1]?.length || 0) > (isAsset1 ? decimals1 : decimals2)) {
      return;
    }

    if (isReservedDataEmpty) {
      setValue(isAsset1 ? 'amount1Desired' : 'amount2Desired', value);
      return;
    }

    const amount = parseAssets(
      value,
      isAsset1 ? decimals1 : decimals2,
    );
    const getSwapPrice = isAsset1 ? getSwapPriceExactTokensForTokens : getSwapPriceTokensForExactTokens;

    const tradeData = await getSwapPrice(enum1, enum2, amount, false);

    const decimalsOut = isAsset1 ? decimals2 : decimals1;
    const formatedValue = formatAssets(tradeData, decimalsOut);
    const sanitizedValue = sanitizeValue(formatedValue.toString());
    setValue('amount1Desired', isAsset1 ? value : sanitizedValue);
    setValue('amount2Desired', isAsset1 ? sanitizedValue : value);
    await trigger();
  };

  useEffect(() => {
    dispatch(walletActions.getAssetsBalance.call([asset1, asset2]));
  }, [dispatch, asset1, asset2]);

  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className={styles.h3}>
        ADD LIQUIDITY FOR PAIR
        {' '}
        {asset1ToShow}
        {' - '}
        {asset2ToShow}
      </h3>
      <div className={cx(styles.title, styles.titleFlex)}>
        <span>
          Amount
          {' '}
          {asset1ToShow}
          {' '}
          Desired
        </span>
        {assetsBalance && assetsBalance.length > 0
        && (
        <span>
          Balance
          {' '}
          {assetsBalance[0]
            ? formatAssets(assetsBalance[0], decimals1, { symbol: asset1ToShow, withAll: true }) : 0}
        </span>
        )}
      </div>
      <TextInput
        required
        validate={(v) => validate(v, assetsBalance[0], decimals1, asset1)}
        errorTitle={asset1ToShow}
        register={register}
        name="amount1Desired"
        onChange={(e) => handleChangeInput(e, asset1)}
      />
      {errors?.amount1Desired && (
        <div className={styles.error}>{errors.amount1Desired.message}</div>
      )}
      <div className={cx(styles.title, styles.titleFlex)}>
        <span>
          Amount
          {' '}
          {asset2ToShow}
          {' '}
          Desired
        </span>
        {assetsBalance && assetsBalance.length > 0
        && (
        <span>
          Balance
          {' '}
          {assetsBalance[1]
            ? formatAssets(assetsBalance[1], decimals2, { symbol: asset2ToShow, withAll: true }) : 0}
        </span>
        )}
      </div>
      <TextInput
        required
        validate={(v) => validate(v, assetsBalance[1], decimals2, asset2)}
        errorTitle={asset2ToShow}
        register={register}
        name="amount2Desired"
        onChange={(e) => handleChangeInput(e, asset2)}
      />
      {errors?.amount2Desired && (
        <div className={styles.error}>{errors.amount2Desired.message}</div>
      )}
      <div className={cx(styles.title, isDisplayNone)}>
        Max Slippage (in percent %)
      </div>
      <TextInput
        className={cx(isDisplayNone)}
        validate={(v) => (!v ? true : !Number.isNaN(parseInt(v)) || 'Not a valid number')}
        errorTitle="minAmountPercent"
        register={register}
        name="minAmountPercent"
        placeholder="Default max slippage is 0.5%"
      />
      {errors?.minAmountPercent && (
        <div className={cx(styles.error, isDisplayNone)}>{errors.minAmountPercent.message}</div>
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
          Add Liquidity
        </Button>
      </div>
    </form>
  );
}

AddLiquidityModal.propTypes = {
  handleModal: PropsTypes.func.isRequired,
  assets: AssetsPropTypes.isRequired,
  isReservedDataEmpty: PropsTypes.bool.isRequired,
};

function AddLiquidityModalWrapper(props) {
  return (
    <ModalRoot>
      <AddLiquidityModal {...props} />
    </ModalRoot>
  );
}

export default AddLiquidityModalWrapper;
