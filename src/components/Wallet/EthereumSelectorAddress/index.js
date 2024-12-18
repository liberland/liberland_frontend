import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ethSelectors } from '../../../redux/selectors';
import { ethActions } from '../../../redux/actions';
import styles from './styles.module.scss';

function EthereumSelectorAddress({ selectedWallet, onAccountSelected }) {
  const dispatch = useDispatch();

  const connected = useSelector(ethSelectors.selectorConnected);
  const connecting = useSelector(ethSelectors.selectorConnecting);
  const error = useSelector(ethSelectors.selectorConnectError);

  useEffect(() => {
    onAccountSelected(undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  useEffect(() => {
    if (selectedWallet) {
      dispatch(
        ethActions.getConnectedEthWallet.call({
          walletId: selectedWallet.id,
        }),
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWallet]);

  if (!selectedWallet) {
    return null;
  }

  if (connecting) {
    return <div>Loading...</div>;
  }

  if (connected) {
    return (
      <label>
        <div className={styles.label}>Select one of your accounts</div>
        <div className={styles.selectWrapper}>
          <select
            placeholder="Select account"
            onChange={(event) => {
              if (event.target.value) {
                onAccountSelected(event.target.value);
              }
            }}
            className={styles.select}
          >
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <option value="" />
            {connected.accounts.map((account) => (
              <option value={account} key={account}>
                {account}
              </option>
            ))}
          </select>
        </div>
      </label>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        Something went wrong.
        <br />
        Try reconnecting provider.
      </div>
    );
  }

  return null;
}

EthereumSelectorAddress.propTypes = {
  onAccountSelected: PropTypes.func.isRequired,
  selectedWallet: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default EthereumSelectorAddress;
