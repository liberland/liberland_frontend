import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import PropTypes from 'prop-types';
import ModalRoot from '../../../Modals/ModalRoot';
import { ethSelectors } from '../../../../redux/selectors';
import Button from '../../../Button/Button';
import { formatCustom, parseAssets } from '../../../../utils/walletHelpers';
import styles from './styles.module.scss';
import { ethActions } from '../../../../redux/actions';

function StakeForm({
  account,
  stakingToken,
  onClose,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const connected = useSelector(ethSelectors.selectorConnected);
  const onSubmit = async ({ stake }) => {
    const signer = await connected.provider.getSigner(account);
    dispatch(ethActions.stakeTokens.call({
      account: signer,
      erc20Address: stakingToken.address,
      tokens: parseAssets(stake, stakingToken.decimals),
    }));
  };

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      layout="vertical"
      className={styles.form}
    >
      <Form.Item
        label="Stake your ETH-LLD Uniswap v2 liquidity token"
        name="stake"
        rules={[{ required: true }]}
      >
        <InputNumber placeholder={stakingToken.symbol} stringMode controls={false} />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button onClick={onClose}>
          Close
        </Button>
        <Button
          secondary
          type="button"
          onClick={() => form.setFieldValue('stake', formatCustom(stakingToken.balance, stakingToken.balance))}
        >
          Stake all
          {' '}
          {formatCustom(stakingToken.balance, stakingToken.decimals)}
          {' tokens'}
        </Button>
        <Button
          primary
          type="submit"
        >
          Stake tokens
        </Button>
      </Flex>
    </Form>
  );
}

StakeForm.propTypes = {
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

function StakeFormModalWrapper(props) {
  const [show, setShow] = useState();
  return (
    <div className={styles.modal}>
      <Button primary medium onClick={() => setShow(true)}>
        Stake LP tokens
      </Button>
      {show && (
        <ModalRoot>
          <StakeForm {...props} onClose={() => setShow(false)} />
        </ModalRoot>
      )}
    </div>
  );
}

export default StakeFormModalWrapper;
