import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Fuse from 'fuse.js';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Flex from 'antd/es/flex';
import Spin from 'antd/es/spin';
import AutoComplete from 'antd/es/auto-complete';
import Paragraph from 'antd/es/typography/Paragraph';
import InputNumber from 'antd/es/input-number';
import Title from 'antd/es/typography/Title';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import {
  walletSelectors,
  blockchainSelectors,
  registriesSelectors,
} from '../../../../../redux/selectors';
import { registriesActions, walletActions } from '../../../../../redux/actions';
import Button from '../../../../Button/Button';
import InputSearch from '../../../../InputComponents/InputSearchAddressName';
import CompanyDetail from '../../CompanyDisplay';
import CompanyImage from '../../CompanyImage';
import truncate from '../../../../../utils/truncate';
import styles from './styles.module.scss';

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
  const additionalAssets = useSelector(
    walletSelectors.selectorAdditionalAssets,
  );
  const type = isStock ? 'stock' : 'asset';
  const typeCapitalized = isStock ? 'Stock' : 'Asset';

  useEffect(() => {
    dispatch(registriesActions.getOfficialRegistryEntries.call());
  }, [dispatch]);

  const allRegistries = useSelector(registriesSelectors.allRegistries)?.officialRegistryEntries;
  const [shownOptions, setShownOptions] = useState(allRegistries);
  const [extra, setExtra] = useState(<div className="description">None</div>);
  const mappedRegistries = useMemo(() => (allRegistries ? groupBy(allRegistries, 'id') : {}), [allRegistries]);
  const search = useMemo(
    () => new Fuse(allRegistries, {
      keys: ['id', 'name'],
      distance: 3,
    }),
    [allRegistries],
  );
  const companyIdValue = Form.useWatch('companyId', form);
  const updateExtra = useCallback((companyId) => {
    const { name: companyName, logoURL: companyLogo } = mappedRegistries[companyId]?.[0] || {};
    if (companyId) {
      setExtra(
        <Flex wrap gap="15px" align="center" className={styles.extra}>
          <div className="description">
            {truncate(companyName || 'Unknown', 15)}
          </div>
          <CompanyImage
            id={companyId}
            size={32}
            logo={companyLogo}
            name={companyName || 'Unknown'}
          />
        </Flex>,
      );
    } else {
      setExtra(<div className="description">None</div>);
    }
  }, [mappedRegistries]);

  useEffect(() => {
    updateExtra(defaultValues.companyId);
  }, [updateExtra, defaultValues.companyId]);

  const onSubmit = async ({
    name,
    symbol,
    decimals,
    balance,
    admin,
    issuer,
    freezer,
    companyId,
  }) => {
    setLoading(true);
    try {
      const nextId = isCreate
        ? additionalAssets
          .map((asset) => asset.index)
          .filter(Boolean)
          .sort((a, b) => b - a)[0] + 1
        : defaultValues.id;

      dispatch(
        walletActions.createOrUpdateAsset.call({
          id: nextId,
          name,
          symbol,
          decimals,
          minBalance: balance,
          admin,
          issuer,
          freezer,
          owner: userWalletAddress,
          companyId,
          isCreate,
          defaultValues,
          isStock,
        }),
      );
      onClose();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setLoading(false);
    }
  };

  const submitButtonText = isCreate
    ? `Create ${type} (~200 LLD)`
    : `Update ${type}`;

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
      <Title level={2}>
        {isCreate ? `Create ${type}` : `Update ${type}`}
      </Title>
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
      <Form.Item
        name="companyId"
        label="Related company"
        extra={extra}
      >
        <Flex vertical gap="20px">
          <AutoComplete
            disabled={!allRegistries?.length}
            placeholder={!allRegistries?.length ? 'No companies found' : 'Select related company'}
            onSelect={(_, { value }) => {
              form.setFieldValue('companyId', value);
              updateExtra(value);
            }}
            onFocus={() => setShownOptions(allRegistries)}
            onSearch={(value) => setShownOptions(search.search(value).map(({ item }) => item))}
            options={shownOptions?.map(({
              id,
              name,
              logoURL,
            }) => ({
              value: id,
              label: <CompanyDetail id={id} size={40} logo={logoURL} name={name} />,
            })) || []}
            onBlur={() => updateExtra(companyIdValue)}
          />
        </Flex>
      </Form.Item>
      <Paragraph>May ask you to sign up to 5 transactions</Paragraph>
      <Flex wrap gap="15px">
        <Button disabled={loading} medium onClick={onClose}>
          Close
        </Button>
        <Button primary medium type="submit" disabled={loading}>
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
  companyId: PropTypes.number,
});

CreateOrUpdateAssetForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  isCreate: PropTypes.bool,
  isStock: PropTypes.bool,
  defaultValues,
};

export default CreateOrUpdateAssetForm;
