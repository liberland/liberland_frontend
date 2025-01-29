import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Title from 'antd/es/skeleton/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import { BN_ZERO } from '@polkadot/util';
import Button from '../Button/Button';
import { walletActions } from '../../redux/actions';
import { parseMerits, valueToBN } from '../../utils/walletHelpers';
import { walletSelectors } from '../../redux/selectors';
import modalWrapper from './components/ModalWrapper';
import ButtonModalArrow from './components/OpenModalButtonWithArrow';

function PolitipoolForm({ onClose }) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const maxUnbond = valueToBN(balances?.liquidMerits?.amount ?? 0);

  const [form] = Form.useForm();

  const handleSubmitStakeLiberland = ({ amount }) => {
    dispatch(
      walletActions.stakeToLiberland.call({
        amount: parseMerits(amount),
      }),
    );
    onClose();
  };

  const validateUnbondValue = (_, textUnbondValue) => {
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
    <Form form={form} layout="vertical" onFinish={handleSubmitStakeLiberland}>
      <Title level={3}>PolitiPool</Title>
      <Form.Item
        name="amount"
        label="Amount LLM"
        extra={(
          <Paragraph>
            Thank you for contributing with your voluntary tax. You will be able
            to use your LLMs as voting power and also dividend rewards in case
            of a government budget surplus. However, keep in mind that should
            you wish to go on welfare, you will only be able to unpool 10% of
            your LLMs a year.
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
        <Button onClick={onClose}>Cancel</Button>
        <Button primary type="submit">
          Stake
        </Button>
      </Flex>
    </Form>
  );
}

PolitipoolForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function ButtonModal(props) {
  return <ButtonModalArrow text="Politipool" primary {...props} />;
}

const PolitipoolLLMModal = modalWrapper(PolitipoolForm, ButtonModal);

export default PolitipoolLLMModal;
