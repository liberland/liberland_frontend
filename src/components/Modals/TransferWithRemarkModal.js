import React, { useMemo } from 'react';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import Select from 'antd/es/select';
import PropTypes from 'prop-types';
import { BN } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import {
  parseAssets,
} from '../../utils/walletHelpers';
import InputSearch from '../InputComponents/InputSearchAddressName';
import RemarkForm from '../WalletCongresSenate/RemarkForm';
import { IndexHelper } from '../../utils/council/councilEnum';
import RemarkFormUser from '../Wallet/RemarkFormUser';
import Validator from '../../utils/validator';

const optionsInput = [{
  value: 'LLD',
  label: 'Liberland Dolar (LLD)',
  index: IndexHelper.LLD,
},
{
  value: 'POLITIPOOL_LLM',
  label: 'Politipool LLM',
  index: IndexHelper.POLITIPOOL_LLM,
}];

function TransferWithRemarkModal({
  closeModal,
  submit,
  userRemark,
  additionalAssets,
  maxUnbond,
  politipoolLlm,
}) {
  const options = useMemo(() => {
    const activeAssets = additionalAssets.filter((item) => item.balance?.balance > 0);

    const itemsArray = activeAssets.map((
      { index, metadata, balance },
    ) => ({
      index,
      display: `${metadata.name} (${metadata.symbol})`,
      value: metadata.symbol,
      decimals: metadata.decimals,
      balance: balance.balance,
    }));
    return [...optionsInput, ...itemsArray];
  }, [additionalAssets]);

  const [form] = Form.useForm();

  const getFieldStateSelect = Form.useWatch('select', form) || 'LLD';

  const validate = (_, value) => {
    if (Number.isNaN(Number(value))) {
      return Promise.reject('Not a number');
    }
    const validateWrapper = (validated) => (
      validated === true ? Promise.resolve() : Promise.reject(validated)
    );
    const itemData = options.find((item) => item.value === getFieldStateSelect);
    const { index, decimals, balance } = itemData;
    if (Number(index) < 0) {
      if (index === IndexHelper.POLITIPOOL_LLM) {
        return validateWrapper(Validator.validateMeritsValue(politipoolLlm, value));
      }
      return validateWrapper(Validator.validateDollarsValue(maxUnbond, value));
    }
    return validateWrapper(Validator.validateValue(
      typeof balance === 'string' ? new BN(balance.slice(2), 16) : new BN(balance),
      parseAssets(value, decimals),
    ));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        id: 0,
      }}
      onFinish={(values) => submit(values, options)}
    >
      <Title level={3}>
        Spend
        {' '}
        {getFieldStateSelect}
        {' '}
        with remark
      </Title>
      <Paragraph className={styles.description}>
        You are going to spend
        {' '}
        {getFieldStateSelect}
        {' '}
        with remark
      </Paragraph>
      <Form.Item
        name="select"
        label="Transfer"
        rules={[{ required: true }]}
        initialValue="LLD"
      >
        <Select
          defaultActiveFirstOption
          options={options}
        />
      </Form.Item>
      <Form.Item
        label="Amount"
        name="transfer"
        rules={[{ required: true }, { validator: validate }]}
      >
        <InputNumber stringMode controls={false} />
      </Form.Item>
      <Form.Item
        label="Recipient"
        name="recipient"
        rules={[{ required: true }]}
      >
        <InputSearch />
      </Form.Item>
      <div>
        {userRemark ? (
          <RemarkFormUser form={form} />
        ) : (
          <RemarkForm form={form} />
        )}
      </div>

      <Flex wrap gap="15px">
        <Button onClick={closeModal}>
          Cancel
        </Button>
        <Button primary type="submit">
          Submit
        </Button>
      </Flex>
    </Form>
  );
}

TransferWithRemarkModal.defaultProps = {
  userRemark: false,
};

TransferWithRemarkModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  userRemark: PropTypes.bool,
  submit: PropTypes.func.isRequired,
  additionalAssets: PropTypes.arrayOf(PropTypes.shape({
    metadata: {
      symbol: PropTypes.string,
      name: PropTypes.string,
      decimals: PropTypes.number,
    },
    balance: {
      balance: PropTypes.number,
    },
  })),
  maxUnbond: PropTypes.number.isRequired,
  politipoolLlm: PropTypes.number.isRequired,
};

function TransferWithRemarkModalWrapper(props) {
  return (
    <ModalRoot>
      <TransferWithRemarkModal {...props} />
    </ModalRoot>
  );
}

export default TransferWithRemarkModalWrapper;
