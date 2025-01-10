import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import PropTypes from 'prop-types';
import ModalRoot from '../../../Modals/ModalRoot';
import { ethSelectors } from '../../../../redux/selectors';
import Button from '../../../Button/Button';
import { formatCustom } from '../../../../utils/walletHelpers';
import styles from './styles.module.scss';
import { ethActions } from '../../../../redux/actions';

function WithdrawForm({
  account,
  stakingToken,
  onClose,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const connected = useSelector(ethSelectors.selectorConnected);
  const onSubmit = async ({ withdraw }) => {
    const signer = await connected.provider.getSigner(account);
    dispatch(ethActions.withdrawTokens({ account: signer, amount: withdraw }));
  };

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      layout="vertical"
    >
      <Form.Item
        name="withdraw"
        label="Withdraw your ETH-LLD Uniswap v2 liquidity token"
        rules={[{ required: true }]}
      >
        <InputNumber stringMode controls={false} />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button onClick={onClose}>
          Close
        </Button>
        <Button
          secondary
          medium
          type="button"
          onClick={() => form.setFieldValue('withdraw', stakingToken.balance)}
        >
          Withdraw all
          {' '}
          {formatCustom(stakingToken.balance, stakingToken.decimals)}
          {' tokens'}
        </Button>
        <Button
          primary
          type="submit"
        >
          Withdraw tokens
        </Button>
      </Flex>
    </Form>
  );
}

WithdrawForm.propTypes = {
  account: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  stakingToken: PropTypes.shape({
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
    decimals: PropTypes.number.isRequired,
  }).isRequired,
};

function WithdrawFormModalWrapper(props) {
  const [show, setShow] = useState();
  return (
    <div className={styles.modal}>
      <Button primary medium onClick={() => setShow(true)}>
        Withdraw tokens
      </Button>
      {show && (
        <ModalRoot>
          <WithdrawForm {...props} onClose={() => setShow(false)} />
        </ModalRoot>
      )}
    </div>
  );
}

export default WithdrawFormModalWrapper;
