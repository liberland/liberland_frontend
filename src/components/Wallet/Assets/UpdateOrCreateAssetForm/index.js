import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
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
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);

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
    setSuccess(false);
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
      setSuccess(true);
    } catch {
      form.setFields([
        {
          name: 'name',
          errors: 'Something went wrong',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const type = isStock ? 'stock' : 'asset';
  const typeCapitalized = isStock ? 'Stock' : 'Asset';
  const submitButtonText = isCreate ? `Create ${type} (~200 LLD)` : `Update ${type}`;

  if (!userWalletAddress || !additionalAssets) {
    return <div>Loading...</div>;
  }

  return (
    <Form
      onFinish={onSubmit}
      form={form}
      className={styles.form}
    >
      <div className={styles.asset}>
        <div className={styles.inputWrapper}>
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
        </div>
        {success && (
          <div className={styles.success}>
            {typeCapitalized}
            {' '}
            {isCreate ? 'created' : 'updated'}
            {' '}
            successfully
          </div>
        )}
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
      </div>
      <div className={styles.asset}>
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
      </div>
      <hr className={styles.divider} />
      <div className={styles.asset}>
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
      </div>
      <hr className={styles.divider} />
      <div className={styles.buttonRow}>
        <div className={styles.closeForm}>
          <Button disabled={loading} medium onClick={onClose}>
            Close
          </Button>
        </div>
        <div>
          <Button
            primary
            medium
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : submitButtonText}
          </Button>
        </div>
      </div>
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
  return (
    <div className={isCreate ? styles.modal : undefined}>
      <Button
        primary
        medium
        onClick={() => setShow(true)}
      >
        {isCreate ? `Create ${isStock ? 'stock' : 'asset'}` : 'Update'}
      </Button>
      {show && (
        <ModalRoot id="create-or-update">
          <UpdateOrCreateAssetForm
            defaultValues={dV}
            isCreate={isCreate}
            onClose={() => setShow(false)}
            isStock={isStock}
          />
        </ModalRoot>
      )}
    </div>
  );
}

UpdateOrCreateAssetFormModalWrapper.propTypes = {
  isCreate: PropTypes.bool,
  defaultValues,
};

export default UpdateOrCreateAssetFormModalWrapper;
