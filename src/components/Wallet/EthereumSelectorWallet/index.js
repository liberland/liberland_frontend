import React from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ethSelectors } from '../../../redux/selectors';
import { ethActions } from '../../../redux/actions';
import styles from './styles.module.scss';

function EthereumSelectorWallet({ onWalletSelected }) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(ethActions.getEthWalletOptions.call());
  }, [dispatch]);

  const walletOptions = useSelector(ethSelectors.selectorWalletOptions);
  const walletLoading = useSelector(ethSelectors.selectorWalletOptionsLoading);

  if (walletLoading) {
    return <div>Loading...</div>;
  }

  return (
    <label>
      <div className={styles.label}>
        Select ETH wallet provider
      </div>
      <ReactSearchAutocomplete
        formatResult={(item) => item.name}
        items={walletOptions}
        onSelect={onWalletSelected}
        placeholder="Select wallet provider"
        onClear={() => onWalletSelected(undefined)}
        showItemsOnFocus
      />
    </label>
  );
}

EthereumSelectorWallet.propTypes = {
  onWalletSelected: PropTypes.func.isRequired,
  selectedWallet: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default EthereumSelectorWallet;
