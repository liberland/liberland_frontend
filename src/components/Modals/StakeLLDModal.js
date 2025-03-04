import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import { useDispatch, useSelector } from 'react-redux';
import { BN, BN_ZERO } from '@polkadot/util';
import Button from '../Button/Button';
import { validatorActions } from '../../redux/actions';
import { walletSelectors } from '../../redux/selectors';
import { parseDollars, formatDollars, valueToBN } from '../../utils/walletHelpers';
import modalWrapper from './components/ModalWrapper';
import OpenModalButton from './components/OpenModalButton';

function StakeLLDForm({
  onClose,
}) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);

  const maxBond = BN.max(
    BN_ZERO,
    valueToBN(balances?.liquidAmount?.amount ?? 0)
      .sub(parseDollars('2')), // leave at least 2 liquid LLD...
  );

  const [form] = Form.useForm();

  const onSubmit = (values) => {
    const bondValue = parseDollars(values.bondValue);
    dispatch(validatorActions.stakeLld.call({ bondValue }));
    onClose();
  };

  const validateBondValue = (_, textBondValue) => {
    try {
      const bondValue = parseDollars(textBondValue);
      if (bondValue.gt(maxBond)) {
        return Promise.reject('Minimum of 2 LLD must remain after transaction');
      } if (bondValue.lte(BN_ZERO)) {
        return Promise.reject('Invalid amount');
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.reject('Invalid amount');
    }
  };

  return (
    <Form
      initialValues={{
        bondValue: formatDollars(maxBond).replaceAll(',', ''),
      }}
      form={form}
      layout="vertical"
      onFinish={onSubmit}
    >
      <Title level={3}>Stake LLD</Title>
      <Paragraph>
        You can stake up to
        {' '}
        {formatDollars(maxBond)}
        {' '}
        LLD
      </Paragraph>
      <Form.Item
        name="bondValue"
        label="Amount to stake"
        extra={(
          <Paragraph>
            You will be able to earn staking rewards proportional to the LLD you stake.
            Note that unstaking takes 1 month and for the duration
            of staking and unstaking your LLDs will not be tradeable.
          </Paragraph>
        )}
        rules={[
          { required: true },
          {
            validator: validateBondValue,
          },
        ]}
      >
        <InputNumber stringMode controls={false} />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          primary
          type="submit"
        >
          Stake
        </Button>
      </Flex>
    </Form>
  );
}

StakeLLDForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  const { label } = props;
  return (
    <OpenModalButton text={label} {...props} />
  );
}

ButtonModal.propTypes = {
  label: PropTypes.string.isRequired,
};

const StakeLLDModal = modalWrapper(StakeLLDForm, ButtonModal);

export default StakeLLDModal;
