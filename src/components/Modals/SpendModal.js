import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import InputNumber from 'antd/es/input-number';
import Flex from 'antd/es/flex';
import { useDispatch } from 'react-redux';
import Button from '../Button/Button';
import InputSearch from '../InputComponents/InputSearchAddressName';
import { parseMerits } from '../../utils/walletHelpers';
import Validator from '../../utils/validator';
import useCongressExecutionBlock from '../../hooks/useCongressExecutionBlock';
import RemarkForm from '../WalletCongresSenate/RemarkForm';
import { encodeRemark } from '../../api/nodeRpcCall';
import { OfficeType } from '../../utils/officeTypeEnum';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function SpendForm({
  onClose, onSend, spendData, officeType, balance,
}) {
  const dispatch = useDispatch();
  const {
    name, title = `Spend ${name}`,
    description = 'You are going to create spend token proposal',
    subtitle = 'Spend to address',
    submitButtonText = 'Make transfer',
  } = spendData;

  const [form] = Form.useForm();
  const votingDays = Form.useWatch('votingDays', form);
  const executionBlock = useCongressExecutionBlock(votingDays);
  const [isLoading, setIsLoading] = useState();

  const transfer = async (values) => {
    const {
      project, description: descriptionRemark, category, supplier, amount, recipient, amountInUsd, finalDestination,
    } = values;
    const remarkInfo = {
      project,
      description: descriptionRemark,
      category,
      supplier,
      currency: name,
      date: Date.now(),
      finalDestination,
      amountInUSDAtDateOfPayment: Number(amountInUsd),
    };

    const encodedRemark = await encodeRemark(remarkInfo);
    dispatch(onSend({
      transferToAddress: recipient,
      transferAmount: parseMerits(amount),
      remarkInfo: encodedRemark,
      executionBlock,
    }));
    onClose();
  };

  return (
    <Form
      initialValues={{
        votingDays: '7',
      }}
      form={form}
      layout="vertical"
      onFinish={transfer}
    >
      <Title level={3}>
        {title}
      </Title>
      <Paragraph>
        {description}
      </Paragraph>
      <Form.Item
        label={subtitle}
        name="recipient"
        rules={[{ required: true }]}
      >
        <InputSearch />
      </Form.Item>
      <Form.Item
        name="amount"
        label="Amount"
        rules={[
          { required: true },
          {
            validator: (_, textValue) => (
              Validator.validateMeritsValue(balance, textValue) === true
                ? Promise.resolve()
                : Promise.reject('Invalid amount')
            ),
          },
        ]}
      >
        <InputNumber placeholder={`Amount ${name}`} controls={false} stringMode />
      </Form.Item>

      <RemarkForm form={form} setIsLoading={setIsLoading} />

      {officeType === OfficeType.CONGRESS && (
        <>
          <Form.Item
            name="votingDays"
            label="Congress voting time in days"
            extra="How long will it take for congress to close this motion?"
            rules={[{ required: true }, { min: 1 }]}
          >
            <InputNumber controls={false} />
          </Form.Item>
          <Paragraph>
            If motion passes in time, actual transfer will execute on block
            {' '}
            {executionBlock}
            .
          </Paragraph>
        </>
      )}

      <Flex wrap gap="15px">
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          primary
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? 'Loading...' : submitButtonText}
        </Button>
      </Flex>
    </Form>
  );
}

SpendForm.defaultProps = {
  spendData: {
    title: '',
    description: '',
    subtitle: '',
    submitButtonText: '',
  },
};

SpendForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  spendData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    subtitle: PropTypes.string,
    submitButtonText: PropTypes.string,
  }),
  officeType: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  balance: PropTypes.object.isRequired,
};

function ButtonModal(props) {
  const { label } = props;

  return (
    <OpenModalButton primary {...props}>
      {label}
    </OpenModalButton>
  );
}

ButtonModal.propTypes = {
  label: PropTypes.string.isRequired,
};

const ProposeBudgetModal = modalWrapper(SpendForm, ButtonModal);

export default ProposeBudgetModal;
