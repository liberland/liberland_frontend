import React from 'react';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Checkbox from 'antd/es/checkbox';
import Flex from 'antd/es/flex';
import Input from 'antd/es/input';
import InputNumber from 'antd/es/input-number';
import Select from 'antd/es/select';
import Slider from 'antd/es/slider';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import { BN, BN_ZERO, isHex } from '@polkadot/util';
import Button from '../Button/Button';

import { validatorActions } from '../../redux/actions';
import { validatorSelectors, walletSelectors } from '../../redux/selectors';
import { formatDollars, parseDollars } from '../../utils/walletHelpers';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function CreateValidatorForm({
  onClose,
}) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const payee = useSelector(validatorSelectors.payee);
  const maxBond = BN.max(
    new BN(0),
    (new BN(balances?.liquidAmount?.amount ?? 0))
      .sub(parseDollars('2')), // leave at least 2 liquid LLD...
  );

  const [form] = Form.useForm();

  const onSubmit = (values) => {
    const bondValue = parseDollars(values.bondValue);
    const commission = (new BN(values.commission)).mul(new BN(10000000));
    const blocked = !values.allow_nominations;
    dispatch(validatorActions.createValidator.call({
      bondValue, commission, blocked, keys: values.keys, payee: values.payee,
    }));
    onClose();
  };

  const validateBondValue = (textBondValue) => {
    try {
      const bondValue = parseDollars(textBondValue);
      if (bondValue.gt(maxBond)) {
        return Promise.reject('Minimum of 2 LLD must remain after transaction');
      }
      if (bondValue.lte(BN_ZERO)) {
        return Promise.reject('Invalid amount');
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.reject('Invalid amount');
    }
  };

  return (
    <Form
      onFinish={onSubmit}
      form={form}
      layout="vertical"
      initialValues={{
        bondValue: formatDollars(maxBond).replaceAll(',', ''),
        commission: '20',
        allow_nominations: true,
        payee: payee ? payee.toString() : 'Staked',
      }}
    >
      <Title level={3}>Create validator</Title>
      <Paragraph>
        You can stake up to
        {' '}
        {formatDollars(maxBond)}
        {' '}
        LLD
      </Paragraph>
      <Form.Item
        name="bondValue"
        label="Amount"
        extra="Amount to stake in your validator"
        rules={[
          { required: true },
          { validator: validateBondValue },
        ]}
      >
        <InputNumber stringMode controls={false} />
      </Form.Item>
      <Form.Item
        name="comission"
        label="Reward commission percentage"
        rules={[{ required: true }]}
        extra="The commission is deducted from all rewards before the remainder is split with nominators."
      >
        <Slider
          min={0}
          max={100}
        />
      </Form.Item>
      <Form.Item
        name="allow_nominations"
        valuePropName="checked"
        label="Allow new nominations"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        name="payee"
        rules={[{ required: true }]}
        label="Staking rewards destination"
      >
        <Select
          options={[
            { value: 'Staked', label: 'Increase stake' },
            { value: 'Stash', label: 'Deposit in the account (without staking)' },
            { value: 'Controller', label: 'Controller (deprecated)' },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="keys"
        label="Session keys"
        rules={[
          { required: true },
          {
            validator: (_, v) => {
              if (v) {
                if (!isHex(v)) {
                  return Promise.reject('Must be a hex string starting with 0x');
                }
                if (v.length !== 256) {
                  return Promise.reject('Invalid length');
                }
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button
          medium
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          primary
          medium
          type="submit"
        >
          Create validator
        </Button>
      </Flex>
    </Form>
  );
}

CreateValidatorForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  const { label } = props;
  return (
    <OpenModalButton small primary text={label || 'Start Validating'} {...props} />
  );
}

ButtonModal.propTypes = {
  label: PropTypes.string,
};

const CreateValidatorModal = modalWrapper(CreateValidatorForm, ButtonModal);

export default CreateValidatorModal;
