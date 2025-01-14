import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Flex from 'antd/es/flex';
import Spin from 'antd/es/spin';
import Paragraph from 'antd/es/typography/Paragraph';
import InputNumber from 'antd/es/input-number';
import PropTypes from 'prop-types';
import { walletSelectors, blockchainSelectors } from '../../../../redux/selectors';
import { walletActions } from '../../../../redux/actions';
import ModalRoot from '../../../Modals/ModalRoot';
import Button from '../../../Button/Button';
import InputSearch from '../../../InputComponents/InputSearchAddressName';
import { useStockContext } from '../../StockContext';

function CreateOrUpdateAssetForm({
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

      dispatch(walletActions.createOrUpdateAsset.call({
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
      }));
      onClose();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setLoading(false);
    }
  };

  const submitButtonText = isCreate ? `Create ${type} (~200 LLD)` : `Update ${type}`;

  if (!userWalletAddress || !additionalAssets) {
    return <Spin />;
  }

  return (
    <Form
      onFinish={onSubmit}
      form={form}
      initialValues={defaultValues}
      layout="vertical"
    >
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
  decimals: PropTypes.number,
  balance: PropTypes.number,
  admin: PropTypes.string,
  issuer: PropTypes.string,
  freezer: PropTypes.string,
});

CreateOrUpdateAssetForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  isCreate: PropTypes.bool,
  isStock: PropTypes.bool,
  defaultValues,
};

function CreateOrUpdateAssetFormModalWrapper({
  isCreate, defaultValues: dV,
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
        {isCreate ? `Create ${isStock ? 'stock' : 'asset'}` : 'Update'}
      </Button>
      {show && (
        <ModalRoot>
          <CreateOrUpdateAssetForm
            defaultValues={dV}
            isCreate={isCreate}
            onClose={() => setShow(false)}
            isStock={isStock}
          />
        </ModalRoot>
      )}
    </>
  );
}

CreateOrUpdateAssetFormModalWrapper.propTypes = {
  isCreate: PropTypes.bool,
  defaultValues,
};

export default CreateOrUpdateAssetFormModalWrapper;
