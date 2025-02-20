import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';
import Flex from 'antd/es/flex';
import Spin from 'antd/es/spin';
import PropTypes from 'prop-types';
import { blockchainSelectors } from '../../../../../redux/selectors';
import { walletActions } from '../../../../../redux/actions';
import Button from '../../../../Button/Button';
import InputSearch from '../../../../InputComponents/InputSearchAddressName';

function MintAssetForm({
  assetId,
  onClose,
  minimumBalance,
  isStock,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState();

  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );

  const onSubmit = async ({
    amount,
    beneficiary,
  }) => {
    setLoading(true);
    try {
      dispatch(walletActions.mintAsset.call({
        amount,
        beneficiary,
        id: assetId,
        owner: userWalletAddress,
      }));
      onClose();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setLoading(false);
    }
  };

  if (!userWalletAddress) {
    return <Spin />;
  }

  const submitText = isStock ? 'Issue stock' : 'Mint assets';

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      layout="vertical"
    >
      <Form.Item
        name="amount"
        label={`${isStock ? 'Issue' : 'Mint'} amount`}
        rules={[
          { required: true },
          {
            validator: (_, input) => {
              if (input) {
                try {
                  const isEnough = window.BigInt(input) > window.BigInt(minimumBalance);
                  if (!isEnough) {
                    return Promise.reject(`Amount is smaller than minimum balance: ${minimumBalance}`);
                  }
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.error(e);
                  return Promise.reject('Amount is invalid');
                }
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber stringMode controls={false} />
      </Form.Item>
      <Form.Item
        name="beneficiary"
        label="Beneficiary"
        rules={[{ required: true }]}
      >
        <InputSearch />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button disabled={loading} medium onClick={onClose}>
          Close
        </Button>
        <Button
          primary
          medium
          type="submit"
          disabled={loading}
        >
          {loading ? 'Minting...' : submitText}
        </Button>
      </Flex>
    </Form>
  );
}

MintAssetForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  assetId: PropTypes.number.isRequired,
  minimumBalance: PropTypes.number.isRequired,
  isStock: PropTypes.bool,
};

export default MintAssetForm;
