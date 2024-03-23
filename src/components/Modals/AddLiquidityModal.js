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
import { dexActions } from '../../redux/actions';
import { dexSelectors, userSelectors } from '../../redux/selectors';
import { getDecimalsForAsset } from '../../utils/dexFormater';
import { AssetsPropTypes } from '../Wallet/Exchange/proptypes';

function AddLiquidityModal({
  handleModal, assets,
}) {
  const dispatch = useDispatch();
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

  const {
    asset1,
    asset2,
    assetData1,
    assetData2,
    asset1ToShow,
    asset2ToShow,
  } = assets;

  const [isChecked, setIsChecked] = useState(false);
  const walletAddress = useSelector(userSelectors.selectWalletAddress);
  const reserves = useSelector(dexSelectors.selectorReserves);

  const isDisplayNone = isChecked ? null : styles.displayNone;

  useEffect(() => {
    dispatch(dexActions.getDexReserves.call({ asset1, asset2 }));
  }, [dispatch, asset1, asset2]);

  const reservesThisAssets = useMemo(() => {
    if (reserves && asset1 && asset2) {
      return reserves[asset1 + asset2];
    }
    return null;
  }, [asset1, asset2, reserves]);

  const onSubmit = (data) => {
    if (!isValid) return;
    const {
      amount1Desired, amount1Min: ammountInputValue1, amount2Desired, amount2Min: ammountInputValue2,
    } = data;

    const asset1Decimals = 10 ** getDecimalsForAsset(asset1, assetData1.decimals);
    const asset2Decimals = 10 ** getDecimalsForAsset(asset2, assetData2.decimals);
    const amount1Min = amount1Desired * ammountInputValue1
    || (reservesThisAssets.asset1 / reservesThisAssets.asset2) * asset1Decimals;
    const amount2Min = amount2Desired * ammountInputValue2
    || (reservesThisAssets.asset2 / reservesThisAssets.asset1) * asset2Decimals;
    const amount1DesiredFormated = amount1Desired * asset1Decimals;
    const amount2DesiredFormated = amount2Desired * asset2Decimals;

    const mintTo = walletAddress;
    dispatch(dexActions.addLiquidity.call({
      amount1Desired: new BN(amount1DesiredFormated),
      amount1Min: new BN(amount1Min),
      amount2Desired: new BN(amount2DesiredFormated),
      amount2Min: new BN(amount2Min),
      asset1,
      asset2,
      walletAddress,
      mintTo,
    }));
    handleModal();
  };
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
      <div className={styles.title}>
        Amount
        {' '}
        {asset1ToShow}
        {' '}
        Desired
      </div>
      <TextInput
        value={null}
        required
        validate={(v) => !Number.isNaN(parseInt(v)) || 'Not a valid number'}
        errorTitle="amount1Desired"
        register={register}
        name="amount1Desired"
      />
      <div className={cx(styles.title, isDisplayNone)}>
        Amount
        {' '}
        {asset1ToShow}
        {' '}
        Min
      </div>
      <TextInput
        className={cx(isDisplayNone)}
        validate={(v) => (!v ? true : !Number.isNaN(parseInt(v)) || 'Not a valid number')}
        errorTitle="amount1Min"
        register={register}
        name="amount1Min"
      />
      {errors?.amount1Desired && (
        <div className={styles.error}>{errors.amount1Desired.message}</div>
      )}
      <div className={styles.title}>
        Amount
        {' '}
        {asset2ToShow}
        {' '}
        Desired
      </div>
      <TextInput
        required
        validate={(v) => !Number.isNaN(parseInt(v)) || 'Not a valid number'}
        errorTitle="amount2Desired"
        register={register}
        name="amount2Desired"
      />
      {errors?.amount2Desired && (
        <div className={styles.error}>{errors.amount2Desired.message}</div>
      )}

      {errors?.amount1Min && (
        <div className={cx(styles.error, isDisplayNone)}>{errors.amount1Min.message}</div>
      )}
      <div className={cx(styles.title, isDisplayNone)}>
        Amount
        {' '}
        {asset2ToShow}
        {' '}
        Min
      </div>
      <TextInput
        className={cx(isDisplayNone)}
        validate={(v) => (!v ? true : !Number.isNaN(parseInt(v)) || 'Not a valid number')}
        errorTitle="amount2Min"
        register={register}
        name="amount2Min"
      />
      {errors?.amount2Min && (
        <div className={cx(styles.error, isDisplayNone)}>{errors.amount2Min.message}</div>
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
