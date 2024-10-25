import React from 'react';
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
      <div className={styles.selectWrapper}>
        <select
          placeholder="Select wallet provider"
          onChange={(event) => {
            if (event.target.value !== '') {
              onWalletSelected(walletOptions[event.target.selectedIndex - 1]);
            }
          }}
          className={styles.select}
        >
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <option value="" />
          {walletOptions.map(({ id, name }) => (
            <option value={id} key={id}>{name}</option>
          ))}
        </select>
      </div>
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
