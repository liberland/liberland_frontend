import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'antd/es/select';
import Form from 'antd/es/form';
import { ethSelectors } from '../../../redux/selectors';
import { ethActions } from '../../../redux/actions';

function EthereumSelectorAddress({ selectedWallet, form }) {
  const dispatch = useDispatch();

  const connected = useSelector(ethSelectors.selectorConnected);

  useEffect(() => {
    form.resetFields(['selectedAccount']);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]); // Yes required, we want to reset on each new connected

  useEffect(() => {
    if (selectedWallet) {
      dispatch(
        ethActions.getConnectedEthWallet.call({
          walletId: selectedWallet,
        }),
      );
    }
  }, [dispatch, selectedWallet]);

  if (!selectedWallet) {
    return null;
  }

  if (connected) {
    return (
      <Form.Item
        label="Select one of your accounts"
        name="selectedAccount"
      >
        <Select
          placeholder="Select account"
          options={connected.accounts.map((account) => ({
            label: account,
            value: account,
          }))}
        />
      </Form.Item>
    );
  }

  return null;
}

EthereumSelectorAddress.propTypes = {
  selectedWallet: PropTypes.string,
  form: PropTypes.shape({
    resetFields: PropTypes.func.isRequired,
  }).isRequired,
};

export default EthereumSelectorAddress;
