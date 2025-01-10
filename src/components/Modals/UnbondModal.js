import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import { useDispatch, useSelector } from 'react-redux';
import { BN_ZERO } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { eraToDays } from '../../utils/staking';
import { validatorActions } from '../../redux/actions';
import { validatorSelectors, walletSelectors } from '../../redux/selectors';
import {
  parseDollars, formatDollars, valueToBN,
} from '../../utils/walletHelpers';

function UnbondModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const bondingDuration = useSelector(validatorSelectors.bondingDuration);
  const maxUnbond = valueToBN(balances?.polkastake?.amount ?? 0);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(validatorActions.getBondingDuration.call());
  }, [dispatch]);

  const onSubmit = (values) => {
    const unbondValue = parseDollars(values.unbondValue);
    dispatch(validatorActions.unbond.call({ unbondValue }));
    closeModal();
  };

  const validateUnbondValue = (_, textUnbondValue) => {
    try {
      const unbondValue = parseDollars(textUnbondValue);
      if (unbondValue.gt(maxUnbond) || unbondValue.lte(BN_ZERO)) {
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
        unbondValue: formatDollars(maxUnbond),
      }}
    >
      <Title level={3}>Unstake LLD</Title>
      <Paragraph>
        You can unstake up to
        {' '}
        {formatDollars(maxUnbond)}
        {' '}
        LLD. Note that unstaking takes up to
        {' '}
        {eraToDays(bondingDuration)}
        {' '}
        days.
      </Paragraph>
      <Form.Item
        name="unboundValue"
        label="Amount to unstake"
        rules={[
          { required: true },
          { validator: validateUnbondValue },
        ]}
      >
        <InputNumber stringMode controls={false} />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button
          medium
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          primary
          medium
          type="submit"
        >
          Schedule unstake
        </Button>
      </Flex>
    </Form>
  );
}

UnbondModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default function UnbondModalWrapper() {
  const [show, setShow] = useState();
  return (
    <>
      <Button onClick={() => setShow(true)}>
        Unstake
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <UnbondModal closeModal={() => setShow(false)} />
        </ModalRoot>
      )}
    </>
  );
}
