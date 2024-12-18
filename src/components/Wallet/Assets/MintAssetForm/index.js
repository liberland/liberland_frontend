import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';
import Flex from 'antd/es/flex';
import useNotification from 'antd/es/notification/useNotification';
import PropTypes from 'prop-types';
import { blockchainSelectors } from '../../../../redux/selectors';
import { walletActions } from '../../../../redux/actions';
import { mintAsset } from '../../../../api/nodeRpcCall';
import ModalRoot from '../../../Modals/ModalRoot';
import Button from '../../../Button/Button';
import InputSearch from '../../../InputComponents/InputSearchAddressName';
import styles from './styles.module.scss';
import { useStockContext } from '../../StockContext';

function MintAssetForm({
  assetId,
  onClose,
  minimumBalance,
  isStock,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState();
  const [api, handle] = useNotification();

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
      await mintAsset({
        amount,
        beneficiary,
        id: assetId,
        owner: userWalletAddress,
      });
      dispatch(walletActions.getAdditionalAssets.call());
      api.success({
        message: `${isStock ? 'Shares' : 'Assets'} minted successfully`,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      form.setFields([
        {
          name: 'amount',
          errors: ['Something went wrong'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!userWalletAddress) {
    return <div>Loading...</div>;
  }

  const submitText = isStock ? 'Issue stock' : 'Mint assets';

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      className={styles.form}
      layout="vertical"
    >
      {handle}
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
        label="Beneficiary amount"
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

function MintAssetFormModalWrapper({
  assetId,
  minimumBalance,
}) {
  const [show, setShow] = useState();
  const { isStock } = useStockContext();
  return (
    <>
      <Button
        primary
        medium
        onClick={() => setShow(true)}
      >
        {isStock ? 'Issue stock' : 'Mint asset'}
      </Button>
      {show && (
        <ModalRoot>
          <MintAssetForm
            assetId={assetId}
            minimumBalance={minimumBalance}
            onClose={() => setShow(false)}
            isStock={isStock}
          />
        </ModalRoot>
      )}
    </>
  );
}

MintAssetFormModalWrapper.propTypes = {
  assetId: PropTypes.number.isRequired,
  minimumBalance: PropTypes.number.isRequired,
};

export default MintAssetFormModalWrapper;
