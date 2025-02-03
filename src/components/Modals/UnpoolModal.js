import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import { BN } from '@polkadot/util';
import Button from '../Button/Button';
import { walletSelectors } from '../../redux/selectors';
import { valueToBN, formatMerits } from '../../utils/walletHelpers';
import { walletActions } from '../../redux/actions';
import modalWrapper from './components/ModalWrapper';
import OpenModalButton from './components/OpenModalButton';

function UnpoolForm({ onClose }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const balances = useSelector(walletSelectors.selectorBalances);
  const unpoolAmount = valueToBN(balances.liberstake.amount)
    .mul(new BN(8742))
    .div(new BN(1000000));
  const unpoolLiquid = valueToBN(balances.liquidMerits.amount).add(
    unpoolAmount,
  );
  const unpoolStake = valueToBN(balances.liberstake.amount).sub(unpoolAmount);

  const handleSubmitUnpool = () => {
    dispatch(walletActions.unpool.call());
    onClose();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmitUnpool}>
      <Title level={3}>Unpool</Title>
      <Paragraph>
        Are you sure you want to go on welfare and temporarily forfeit your
        citizenship rights such as voting for a month? This will instantly turn
        {' '}
        {formatMerits(unpoolAmount)}
        {' '}
        LLM from pooled into liquid for a total of
        {' '}
        {formatMerits(unpoolStake)}
        {' '}
        pooled LLM and
        {formatMerits(unpoolLiquid)}
        {' '}
        liquid.
      </Paragraph>

      <Flex wrap gap="15px">
        <Button onClick={onClose}>Cancel</Button>
        <Button primary type="submit">
          Unpool
        </Button>
      </Flex>
    </Form>
  );
}

UnpoolForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  return <OpenModalButton text="Unpool" {...props} />;
}

const UnpoolModal = modalWrapper(UnpoolForm, ButtonModal);

export default UnpoolModal;
