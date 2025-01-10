import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spin from 'antd/es/spin';
import Form from 'antd/es/form';
import Select from 'antd/es/select';
import { ethSelectors } from '../../../redux/selectors';
import { ethActions } from '../../../redux/actions';

function EthereumSelectorWallet() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ethActions.getEthWalletOptions.call());
  }, [dispatch]);

  const walletOptions = useSelector(ethSelectors.selectorWalletOptions);
  const walletLoading = useSelector(ethSelectors.selectorWalletOptionsLoading);

  if (walletLoading) {
    return <Spin />;
  }

  return (
    <Form.Item
      label="Select ETH wallet provider"
      name="selectedWallet"
    >
      <Select
        placeholder="Select wallet provider"
        options={walletOptions.map(({ id, name }) => ({
          label: name,
          value: id,
        }))}
      />
    </Form.Item>
  );
}

export default EthereumSelectorWallet;
