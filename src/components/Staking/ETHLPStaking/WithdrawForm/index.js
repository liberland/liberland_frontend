import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import PropTypes from 'prop-types';
import { ethSelectors } from '../../../../redux/selectors';
import Button from '../../../Button/Button';
import { formatCustom, parseAssets } from '../../../../utils/walletHelpers';
import { ethActions } from '../../../../redux/actions';
import OpenModalButton from '../../../Modals/components/OpenModalButton';
import modalWrapper from '../../../Modals/components/ModalWrapper';

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
    dispatch(ethActions.withdrawTokens.call({
      account: signer,
      amount: parseAssets(withdraw, stakingToken.decimals),
    }));
    onClose();
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
          onClick={() => form.setFieldValue('withdraw', formatCustom(stakingToken.balance, stakingToken.decimals))}
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

function ButtonModal(props) {
  return (
    <OpenModalButton primary medium text="Withdraw tokens" {...props} />
  );
}

ButtonModal.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
};

const WithdrawFormModal = modalWrapper(WithdrawForm, ButtonModal);

export default WithdrawFormModal;
