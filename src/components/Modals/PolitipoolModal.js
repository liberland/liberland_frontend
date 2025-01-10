import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Title from 'antd/es/skeleton/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import { BN_ZERO } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import { walletActions } from '../../redux/actions';
import { parseMerits, valueToBN } from '../../utils/walletHelpers';
import ButtonArrowIcon from '../../assets/icons/button-arrow.svg';
import { walletSelectors } from '../../redux/selectors';

function PolitipoolModal({ closeModal }) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const maxUnbond = valueToBN(balances?.liquidMerits?.amount ?? 0);

  const [form] = Form.useForm();

  const handleSubmitStakeLiberland = ({ amount }) => {
    dispatch(walletActions.stakeToLiberland.call({
      amount: parseMerits(amount),
    }));
    closeModal();
  };

  const validateUnbondValue = (textUnbondValue) => {
    try {
      const unbondValue = parseMerits(textUnbondValue);
      if (unbondValue.gt(maxUnbond) || unbondValue.lte(BN_ZERO)) {
        return Promise.reject('Invalid amount');
      }
    } catch (e) {
      return Promise.reject('Invalid amount');
    }
    return Promise.resolve();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmitStakeLiberland}
    >
      <Title level={3}>PolitiPool</Title>
      <Form.Item
        name="amount"
        label="Amount LLM"
        extra={(
          <Paragraph>
            Thank you for contributing with your voluntary tax. You will be able to use your LLMs as voting power and
            also dividend rewards in case of a government budget surplus. However, keep in mind that should you wish
            to go on welfare, you will only be able to unpool 10% of your LLMs a year.
          </Paragraph>
        )}
        rules={[
          { required: true },
          {
            validator: validateUnbondValue,
          },
        ]}
      >
        <InputNumber stringMode controls={false} />
      </Form.Item>
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
          Stake
        </Button>
      </Flex>
    </Form>
  );
}

PolitipoolModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function PolitipoolModalWrapper() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className={styles.button} primary onClick={() => setOpen(true)}>
        Politipool
        <img src={ButtonArrowIcon} className={styles.arrowIcon} alt="button icon" />
      </Button>
      {open && (
        <ModalRoot>
          <PolitipoolModal closeModal={() => setOpen(false)} />
        </ModalRoot>
      )}
    </>
  );
}

export default PolitipoolModalWrapper;
