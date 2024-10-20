import React from 'react';
import Autocomplete from 'react-autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ethSelectors } from "../../../redux/selectors";
import { ethActions } from "../../../redux/actions";
import styles from './styles.module.scss';

function EthereumSelectorWallet({ onWalletSelected, selectedWallet }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ethActions.getEthWalletOptions.call());
  }, [dispatch]);

  const walletOptions = useSelector(ethSelectors.selectorWalletOptions);
  const walletLoading = useSelector(ethSelectors.selectorWalletOptionsLoading);

  if (walletLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Autocomplete
      getItemValue={(item) => item.name}
      items={walletOptions}
      renderItem={(item, isHighlighted) => (
        <div className={isHighlighted ? styles.highlighted : styles.notHighlighted}>
          {item.name}
        </div>
      )}
      value={selectedWallet}
      onSelect={onWalletSelected}
    />
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
