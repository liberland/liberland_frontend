import React, { useState, useEffect, useMemo } from 'react';
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
import { dexSelectors, userSelectors, walletSelectors } from '../../redux/selectors';
import {
  calculateAmountDesiredFormatted,
  convertLiquidityData, formatProperlyValue, getDecimalsBN,
  getExchangeRate,
} from '../../utils/dexFormater';
import { AssetsPropTypes } from '../Wallet/Exchange/proptypes';

function AddLiquidityModal({
  handleModal, assets,
}) {
  const dispatch = useDispatch();
  const walletAddress = useSelector(userSelectors.selectWalletAddress);
  const reserves = useSelector(dexSelectors.selectorReserves);
  const assetsBalance = useSelector(walletSelectors.selectorAssetsBalance);
  const [isChecked, setIsChecked] = useState(false);

  const isDisplayNone = isChecked ? null : styles.displayNone;
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      cos: null,
    },
  });

  const {
    asset1,
    asset2,
    assetData1,
    assetData2,
    asset1ToShow,
    asset2ToShow,
  } = assets;

  const reservesThisAssets = useMemo(() => {
    if (reserves && asset1 && asset2) {
      return reserves[asset1 + asset2];
    }
    return null;
  }, [asset1, asset2, reserves]);

  const onSubmit = (data) => {
    if (!isValid) return;
    const {
      amount1Desired, amount2Desired, minAmountPercent,
    } = data;

    const {
      amount1, amount2, amount1Min, amount2Min,
    } = convertLiquidityData(
      amount1Desired,
      amount2Desired,
      asset1,
      asset2,
      assetData1?.decimals,
      assetData2?.decimals,
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
    if (Number.isNaN(parseInt(v))) {
      return 'Not a valid number';
    }
    const decimalsBN = getDecimalsBN(asset, decimals);
    const inputBN = calculateAmountDesiredFormatted(v, decimalsBN);
    const assetBN = new BN(assetBalance);
    if (inputBN.gt(assetBN)) {
      return 'Input greater than balance';
    }
    return true;
  };

  const handleChangeInput = (e, asset) => {
    if (!reservesThisAssets) return;
    const { value } = e.target;
    let rate = null;

    const isAsset1 = asset === reservesThisAssets.asset1Number;

    if (!isAsset1) {
      rate = getExchangeRate(
        reservesThisAssets.asset1,
        reservesThisAssets.asset2,
        assetData1?.decimals,
        assetData2?.decimals,
      );
    } else {
      rate = getExchangeRate(
        reservesThisAssets.asset2,
        reservesThisAssets.asset1,
        assetData2?.decimals,
        assetData1?.decimals,
      );
    }
    const exchangeOtherAssetValue = value * rate;

    if (isAsset1) {
      setValue('amount1Desired', value);
      setValue('amount2Desired', exchangeOtherAssetValue);
    } else {
      setValue('amount1Desired', exchangeOtherAssetValue);
      setValue('amount2Desired', value);
    }
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
            ? formatProperlyValue(asset1, assetsBalance[0], asset1ToShow, assetData1?.decimals || 0) : 0}
        </span>
        )}
      </div>
      <TextInput
        required
        validate={(v) => validate(v, assetsBalance[0], assetData1?.decimals, asset1)}
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
            ? formatProperlyValue(asset2, assetsBalance[1], asset2ToShow, assetData2?.decimals || 0) : 0}
        </span>
        )}
      </div>
      <TextInput
        required
        validate={(v) => validate(v, assetsBalance[1], assetData2?.decimals, asset2)}
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
};

function AddLiquidityModalWrapper(props) {
  return (
    <ModalRoot>
      <AddLiquidityModal {...props} />
    </ModalRoot>
  );
}

export default AddLiquidityModalWrapper;
