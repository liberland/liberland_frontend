import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { createNewPool } from '../../../../api/nodeRpcCall';
import Button from '../../../Button/Button';
import ModalRoot from '../../../Modals/ModalRoot';
import { walletSelectors, blockchainSelectors } from '../../../../redux/selectors';
import { walletActions, dexActions } from '../../../../redux/actions';
import { ExchangeItemPropTypes } from '../proptypes';
import styles from '../styles.module.scss';

function AddAssetFormDisplay({
  poolsData,
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
  });

  const firstAsset = watch('firstAsset', '');
  const secondAsset = watch('secondAsset', '');

  const dispatch = useDispatch();
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);

  React.useEffect(() => {
    dispatch(walletActions.getWallet.call());
  }, [dispatch]);

  const filtered = React.useMemo(() => {
    const allOptions = additionalAssets?.reduce((pairings, aAsset, index) => {
      pairings.push(['Native', aAsset]);
      additionalAssets.slice(index + 1).forEach((bAsset) => {
        pairings.push([
          aAsset,
          bAsset,
        ]);
      });
      return pairings;
    }, []);

    const usedPairings = poolsData.map(({
      asset1,
      assetData1,
      asset2,
      assetData2,
    }) => {
      if (asset1 === 'Native') {
        return ['Native', assetData2.symbol];
      } if (asset2 === 'Native') {
        return [assetData1.symbol, 'Native'];
      }
      return [assetData1.symbol, assetData2.symbol];
    }).reduce((pairings, [aAsset, bAsset]) => {
      pairings[aAsset] ||= {};
      pairings[aAsset][bAsset] = true;
      return pairings;
    }, {});

    return allOptions?.reduce((mappedOptions, [aAsset, bAsset]) => {
      if (aAsset === 'Native') {
        if (!usedPairings[aAsset]?.[bAsset.metadata.symbol] && !usedPairings[bAsset.metadata.symbol]?.[aAsset]) {
          mappedOptions[aAsset] ||= {};
          mappedOptions[aAsset][bAsset.metadata.symbol] = [aAsset, bAsset];
          mappedOptions[bAsset.metadata.symbol] ||= {};
          mappedOptions[bAsset.metadata.symbol][aAsset] = [bAsset, aAsset];
        }
      } else if (bAsset === 'Native') {
        if (!usedPairings[aAsset.metadata.symbol]?.[bAsset] && !usedPairings[bAsset]?.[aAsset.metadata.symbol]) {
          mappedOptions[aAsset.metadata.symbol] ||= {};
          mappedOptions[aAsset.metadata.symbol][bAsset] = [aAsset, bAsset];
          mappedOptions[bAsset] ||= {};
          mappedOptions[bAsset][aAsset.metadata.symbol] = [bAsset, aAsset];
        }
      } else if (!usedPairings[aAsset.metadata.symbol]?.[bAsset.metadata.symbol]
        && !usedPairings[bAsset.metadata.symbol]?.[aAsset.metadata.symbol]) {
        mappedOptions[aAsset.metadata.symbol] ||= {};
        mappedOptions[aAsset.metadata.symbol][bAsset.metadata.symbol] = [aAsset, bAsset];
        mappedOptions[bAsset.metadata.symbol] ||= {};
        mappedOptions[bAsset.metadata.symbol][aAsset.metadata.symbol] = [bAsset, aAsset];
      }
      return mappedOptions;
    }, {});
  }, [poolsData, additionalAssets]);

  const onSubmit = async ({ firstAsset: firstAssetKey, secondAsset: secondAssetKey }) => {
    try {
      const [aAsset, bAsset] = filtered[firstAssetKey][secondAssetKey];
      const getAssetId = (asset) => (
        asset === 'Native'
          ? { Native: 'Native' }
          : { Asset: asset.index.toString() }
      );
      await createNewPool(getAssetId(aAsset), getAssetId(bAsset), walletAddress);
      dispatch(dexActions.getPools.call());
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setError('firstAsset', { message: 'Something went wrong' });
    }
  };

  if (!filtered) {
    return <div>Loading...</div>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.selectRow}>
        <div className={styles.firstAsset}>
          <label>
            <div className={styles.label}>
              Select first pool asset
            </div>
            <div className={styles.selectWrapper}>
              <select
                {...register('firstAsset', {
                  required: 'Select asset',
                })}
                placeholder="Pool asset"
                disabled={isSubmitting}
                onChange={(event) => {
                  setValue('firstAsset', event.target.value);
                }}
                value={firstAsset}
                className={styles.select}
              >
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <option value="" />
                {Object.entries(filtered)
                  .filter(([_, values]) => Object.keys(values).length > 0)
                  .map(([key, value]) => {
                    const humanReadableName = key === 'Native'
                      ? 'Liberland dollar'
                      : Object.values(value)[0][0].metadata.symbol;
                    return (
                      <option
                        value={key}
                        key={key}
                      >
                        {humanReadableName}
                      </option>
                    );
                  })}
              </select>
            </div>
            {errors.firstAsset && (
              <div className={styles.error}>
                {errors.firstAsset.message}
              </div>
            )}
            {isSubmitSuccessful && (
              <div className={styles.success}>
                Pool successfully created
              </div>
            )}
          </label>
        </div>
        <div>
          {firstAsset && (
            <label>
              <div className={styles.label}>
                Select second pool asset
              </div>
              <div className={styles.selectWrapper}>
                <select
                  {...register('secondAsset', {
                    required: 'Select asset',
                  })}
                  disabled={isSubmitting}
                  placeholder="Pool asset"
                  onChange={(event) => {
                    setValue('secondAsset', event.target.value);
                  }}
                  value={secondAsset}
                  className={styles.select}
                >
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <option value="" />
                  {Object.entries(filtered[firstAsset])
                    .map(([key, value]) => {
                      const humanReadableName = key === 'Native'
                        ? 'Liberland dollar'
                        : value[1].metadata.symbol;
                      return (
                        <option
                          value={key}
                          key={key}
                        >
                          {humanReadableName}
                        </option>
                      );
                    })}
                </select>
              </div>
              {errors.secondAsset && (
                <div className={styles.error}>
                  {errors.secondAsset.message}
                </div>
              )}
            </label>
          )}
        </div>
      </div>
      <div className={styles.buttonRow}>
        <div className={styles.closeForm}>
          <Button type="button" medium onClick={onClose} disabled={isSubmitting}>
            Close
          </Button>
        </div>
        <div>
          <Button type="submit" medium primary disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : 'Create pair'}
          </Button>
        </div>
      </div>
    </form>
  );
}

AddAssetFormDisplay.propTypes = {
  onClose: PropTypes.func.isRequired,
  poolsData: PropTypes.arrayOf(
    PropTypes.shape(ExchangeItemPropTypes).isRequired,
  ).isRequired,
};

function AddAssetForm(props) {
  const [show, setShow] = React.useState();
  return (
    <div className={styles.add}>
      <Button primary medium onClick={() => setShow(true)}>
        Create pool
      </Button>
      {show && (
        <ModalRoot>
          <AddAssetFormDisplay {...props} onClose={() => setShow(false)} />
        </ModalRoot>
      )}
    </div>
  );
}

export default AddAssetForm;
