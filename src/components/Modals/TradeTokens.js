import React, { useEffect, useMemo, useState } from 'react';
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
import { userSelectors, dexSelectors } from '../../redux/selectors';
import { getDecimalsForAsset } from '../../utils/dexFormater';
import { AssetsPropTypes } from '../Wallet/Exchange/proptypes';

function TradeTokensModal({
  handleModal, assets, isBuy,
}) {
  const dispatch = useDispatch();
  const walletAdrees = useSelector(userSelectors.selectWalletAddress);
  const reserves = useSelector(dexSelectors.selectorReserves);
  const [isChecked, setIsChecked] = useState(false);
  const isDisplayNone = isChecked ? null : styles.displayNone;

  const {
    asset1,
    asset2,
    assetData1,
    assetData2,
    asset1ToShow,
    asset2ToShow,
  } = assets;

  useEffect(() => {
    dispatch(dexActions.getDexReserves.call({ asset1, asset2 }));
  }, [dispatch, asset1, asset2]);

  const reservesThisAssets = useMemo(() => {
    if (reserves && asset1 && asset2) {
      return reserves[asset1 + asset2];
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
  const onSubmit = (data) => {
    if (!isValid || !reservesThisAssets.asset2 || !reservesThisAssets.asset1) return;
    const { amountIn, amountOutMin } = data;
    const decimals1 = 10 ** getDecimalsForAsset(asset1, assetData1?.decimal);
    const decimals2 = 10 ** getDecimalsForAsset(asset2, assetData2?.decimal);
    const actualDecimal = isBuy ? decimals2 : decimals1;
    const amountMin = amountIn * amountOutMin
    || (reservesThisAssets.asset2 / reservesThisAssets.asset1) * actualDecimal;
    const amountFormated = actualDecimal * amountIn;
    if (isBuy) {
      const buyData = {
        path: { asset1, asset2 },
        amount: new BN(amountFormated),
        amountMin: new BN(amountMin),
        sendTo: walletAdrees,
        walletAdrees,
      };
      dispatch(dexActions.swapTokensForExactTokens.call(buyData));
    } else {
      const sellData = {
        path: { asset1, asset2 },
        amount: new BN(amountFormated),
        amountMin: new BN(amountMin),
        sendTo: walletAdrees,
        walletAdrees,
      };
      dispatch(dexActions.swapExactTokensForTokens.call(sellData));
    }
    handleModal();
  };
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

      <div className={styles.title}>
        Amount In (
        {isBuy ? asset2ToShow : asset1ToShow}
        )
      </div>
      <TextInput
        required
        validate={(v) => {
          if (Number.isNaN(Number(v))) {
            return 'Not a valid number';
          }
          const decimals = isBuy
            ? getDecimalsForAsset(asset2, assetData2?.decimal)
            : getDecimalsForAsset(asset1, assetData1?.decimal);
          const value = (10 ** decimals) * Number(v);

          if (value > Number(isBuy ? reservesThisAssets.asset2 : reservesThisAssets.asset1)) {
            return 'Input value exceeds reserves';
          }
          return true;
        }}
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
