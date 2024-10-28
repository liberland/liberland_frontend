import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../../../Button/Button';
import ModalRoot from '../../../Modals/ModalRoot';
import { walletSelectors } from '../../../../redux/selectors';
import { walletActions } from '../../../../redux/actions';
import { ExchangeItemPropTypes } from '../proptypes';
import styles from '../styles.module.scss';

function AddAssetFormDisplay({
  poolsData,
  onClose,
}) {
  const dispatch = useDispatch();
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);

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
    // eslint-disable-next-line no-console
    console.log(usedPairings);
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
        mappedOptions[bAsset.metadata.symbol] ||= {};
        mappedOptions[bAsset.metadata.symbol][aAsset.metadata.symbol] = [aAsset, bAsset];
        mappedOptions[aAsset.metadata.symbol] ||= {};
        mappedOptions[aAsset.metadata.symbol][bAsset.metadata.symbol] = [bAsset, aAsset];
      }
      return mappedOptions;
    }, {});
  }, [poolsData, additionalAssets]);

  if (!filtered) {
    return <div>Loading...</div>;
  }

  // eslint-disable-next-line no-console
  console.log(filtered);

  return (
    <form className={styles.form}>
      <Button medium onClick={onClose}>
        Close
      </Button>
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
