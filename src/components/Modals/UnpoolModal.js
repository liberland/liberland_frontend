import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import { BN } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import { walletSelectors } from '../../redux/selectors';
import { valueToBN, formatMerits } from '../../utils/walletHelpers';
import { walletActions } from '../../redux/actions';
import ButtonArrowIcon from '../../assets/icons/button-arrow.svg';

function UnpoolModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const balances = useSelector(walletSelectors.selectorBalances);
  const unpoolAmount = valueToBN(balances.liberstake.amount).mul(new BN(8742)).div(new BN(1000000));
  const unpoolLiquid = valueToBN(balances.liquidMerits.amount).add(unpoolAmount);
  const unpoolStake = valueToBN(balances.liberstake.amount).sub(unpoolAmount);

  const handleSubmitUnpool = () => {
    dispatch(walletActions.unpool.call());
    closeModal();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmitUnpool}
    >
      <Title level={3}>Unpool</Title>
      <Paragraph>
        Are you sure you want to go on welfare and temporarily forfeit
        {' '}
        your citizenship rights such as voting for a month?
        {' '}
        This will instantly turn
        {' '}
        {formatMerits(unpoolAmount)}
        {' '}
        LLM from pooled into liquid for a total of
        {' '}
        {formatMerits(unpoolStake)}
        {' '}
        pooled LLM and
        {' '}
        {formatMerits(unpoolLiquid)}
        {' '}
        liquid.
      </Paragraph>

      <Flex wrap gap="15px">
        <Button
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          primary
          type="submit"
        >
          Unpool
        </Button>
      </Flex>
    </Form>
  );
}

UnpoolModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function UnpoolModalWrapper() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className={styles.button} onClick={() => setOpen(true)}>
        Unpool
        <img src={ButtonArrowIcon} className={styles.arrowIcon} alt="button icon" />
      </Button>
      {open && (
        <ModalRoot closeModal={() => setOpen(false)}>
          <UnpoolModal closeModal={() => setOpen(false)} />
        </ModalRoot>
      )}
    </>
  );
}

export default UnpoolModalWrapper;
