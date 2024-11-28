import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import InputNumber from 'antd/es/input-number';
import message from 'antd/es/message';
import Flex from 'antd/es/flex';
import PropTypes from 'prop-types';
import { blockchainSelectors } from '../../../../redux/selectors';
import { walletActions } from '../../../../redux/actions';
import { mintAsset } from '../../../../api/nodeRpcCall';
import ModalRoot from '../../../Modals/ModalRoot';
import Button from '../../../Button/Button';
import InputSearch from '../../../InputComponents/InputSearchAddressName';
import styles from './styles.module.scss';
import { useStockContext } from '../../StockContext';

function MintAssetForm({ assetId, onClose, minimumBalance }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState();
  const { isStock } = useStockContext();

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
      message.success(`${isStock ? 'Shares' : 'Assets'} minted successfully`);
    } catch (e) {
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

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      className={styles.form}
    >
      <Flex wrap gap="15px">
        <Form.Item
          name="amount"
          label="Mint amount"
          rules={[
            { required: true },
            {
              validator: (_, input, callback) => {
                try {
                  const isEnough = window.BigInt(input) > window.BigInt(minimumBalance);
                  if (!isEnough) {
                    callback(`Amount is smaller than minimum balance: ${minimumBalance}`);
                  }
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.error(e);
                  callback('Amount is invalid');
                }
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
      </Flex>
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
          {loading ? 'Minting...' : 'Mint assets'}
        </Button>
      </Flex>
    </Form>
  );
}

MintAssetForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  assetId: PropTypes.number.isRequired,
  minimumBalance: PropTypes.number.isRequired,
};

function MintAssetFormModalWrapper({
  assetId,
  minimumBalance,
}) {
  const [show, setShow] = React.useState();
  return (
    <>
      <Button
        primary
        medium
        flex
        onClick={() => setShow(true)}
      >
        Mint asset
      </Button>
      {show && (
        <ModalRoot>
          <MintAssetForm
            assetId={assetId}
            minimumBalance={minimumBalance}
            onClose={() => setShow(false)}
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
