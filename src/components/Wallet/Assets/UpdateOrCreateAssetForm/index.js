import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Flex from 'antd/es/flex';
import Paragraph from 'antd/es/typography/Paragraph';
import useNotification from 'antd/es/notification/useNotification';
import InputNumber from 'antd/es/input-number';
import PropTypes from 'prop-types';
import { walletSelectors, blockchainSelectors } from '../../../../redux/selectors';
import { walletActions } from '../../../../redux/actions';
import { createOrUpdateAsset } from '../../../../api/nodeRpcCall';
import ModalRoot from '../../../Modals/ModalRoot';
import Button from '../../../Button/Button';
import InputSearch from '../../../InputComponents/InputSearchAddressName';
import styles from './styles.module.scss';
import { useStockContext } from '../../StockContext';

function UpdateOrCreateAssetForm({
  onClose,
  isCreate,
  isStock,
  defaultValues,
}) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);
  const type = isStock ? 'stock' : 'asset';
  const typeCapitalized = isStock ? 'Stock' : 'Asset';
  const [api, handle] = useNotification();

  const onSubmit = async ({
    name,
    symbol,
    decimals,
    balance,
    admin,
    issuer,
    freezer,
  }) => {
    setLoading(true);
    try {
      const nextId = isCreate ? (
        additionalAssets.map((asset) => asset.index)
          .filter(Boolean)
          .sort((a, b) => b - a)[0] + 1
      ) : defaultValues.id;

      await createOrUpdateAsset({
        id: nextId,
        name,
        symbol,
        decimals,
        minBalance: balance,
        admin,
        issuer,
        freezer,
        owner: userWalletAddress,
        isCreate,
        defaultValues,
        isStock,
      });
      dispatch(walletActions.getAdditionalAssets.call());
      api.success({
        message: `${typeCapitalized} ${isCreate ? 'created' : 'updated'} successfully`,
      });
    } catch {
      form.setFields([
        {
          name: 'name',
          errors: ['Something went wrong'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submitButtonText = isCreate ? `Create ${type} (~200 LLD)` : `Update ${type}`;

  if (!userWalletAddress || !additionalAssets) {
    return <div>Loading...</div>;
  }

  return (
    <Form
      onFinish={onSubmit}
      form={form}
      initialValues={defaultValues}
      className={styles.form}
      layout="vertical"
    >
      {handle}
      <Form.Item
        name="name"
        rules={[
          { required: true },
          { min: 3, message: 'Name must be longer than 2 characters' },
        ]}
        label={`${typeCapitalized} name`}
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item
        name="symbol"
        rules={[
          { required: true },
          { min: 3, message: 'Symbol must be longer than 2 characters' },
        ]}
        label={`${typeCapitalized} symbol`}
      >
        <Input placeholder="symbol" />
      </Form.Item>
      <Form.Item
        name="decimals"
        rules={[
          { required: true },
          { type: 'number', message: 'Must be a number' },
        ]}
        label="Decimals"
      >
        <InputNumber controls={false} />
      </Form.Item>
      {isCreate && (
        <Form.Item
          name="balance"
          rules={[
            { required: true },
            { type: 'number', message: 'Must be a number' },
          ]}
          label="Minimal balance"
        >
          <InputNumber controls={false} />
        </Form.Item>
      )}
      <Form.Item
        rules={[{ required: true }]}
        name="admin"
        label="Admin account"
      >
        <InputSearch />
      </Form.Item>
      <Form.Item
        rules={[{ required: true }]}
        name="issuer"
        label="Issuer account"
      >
        <InputSearch />
      </Form.Item>
      <Form.Item
        rules={[{ required: true }]}
        name="freezer"
        label="Freezer account"
      >
        <InputSearch />
      </Form.Item>
      <Paragraph>
        May ask you to sign up to 4 transactions
      </Paragraph>
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
          {loading ? 'Loading...' : submitButtonText}
        </Button>
      </Flex>
    </Form>
  );
}

const defaultValues = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  symbol: PropTypes.string,
  decimals: PropTypes.string,
  balance: PropTypes.number,
  admin: PropTypes.string,
  issuer: PropTypes.string,
  freezer: PropTypes.string,
});

UpdateOrCreateAssetForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  isCreate: PropTypes.bool,
  isStock: PropTypes.bool,
  defaultValues,
};

function UpdateOrCreateAssetFormModalWrapper({
  isCreate, defaultValues: dV,
}) {
  const [show, setShow] = React.useState();
  const { isStock } = useStockContext();
  const modal = (
    <>
      <Button
        primary
        medium
        onClick={() => setShow(true)}
      >
        {isCreate ? `Create ${isStock ? 'stock' : 'asset'}` : 'Update'}
      </Button>
      {show && (
        <ModalRoot>
          <UpdateOrCreateAssetForm
            defaultValues={dV}
            isCreate={isCreate}
            onClose={() => setShow(false)}
            isStock={isStock}
          />
        </ModalRoot>
      )}
    </>
  );
  if (isCreate) {
    return <div className={styles.modal}>{modal}</div>;
  }
  return modal;
}

UpdateOrCreateAssetFormModalWrapper.propTypes = {
  isCreate: PropTypes.bool,
  defaultValues,
};

export default UpdateOrCreateAssetFormModalWrapper;
