import React, { useEffect, useMemo, useState } from 'react';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Divider from 'antd/es/divider';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import Select from 'antd/es/select';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { congressActions } from '../../redux/actions';
import { congressSelectors } from '../../redux/selectors';
import { valueToBN } from '../../utils/walletHelpers';
import { extractItemsFromObject } from '../../utils/council/councilHelper';
import useCongressExecutionBlock from '../../hooks/useCongressExecutionBlock';
import InputSearch from '../InputComponents/InputSearchAddressName';
import RemarkForm from '../WalletCongresSenate/RemarkForm';
import { IndexHelper } from '../../utils/council/councilEnum';

const defaultValueSpending = {
  currency: null,
  amount: null,
  remark: null,
  optionsInput: [{
    value: 'LLD',
    display: 'Liberland Dolar (LLD)',
    index: IndexHelper.LLD,
  }],
  indexItem: 0,
};

function ProposeBudgetModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const allBalance = useSelector(congressSelectors.allBalance);
  const [form] = Form.useForm();

  const executionBlock = useCongressExecutionBlock(7);

  const optionsInputDefault = useMemo(() => allBalance.map((item) => {
    const { metadata, index, balance } = item;
    const { symbol, name, decimals } = metadata;
    return {
      value: symbol,
      display: `${name}  (${symbol})`,
      index,
      decimals,
      balance: balance?.balance || balance,
    };
  }), [allBalance]);

  const onSubmit = async (data) => {
    const budgetProposalItems = await extractItemsFromObject(data.spendings, optionsInputDefault);
    dispatch(congressActions.congressBudgetPropose.call({ budgetProposalItems, executionBlock }));
    closeModal();
  };

  useEffect(() => {
    dispatch(congressActions.getAllBalanceForCongress.call({ isLlmNeeded: true }));
  }, [dispatch]);

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      initialValues={{
        votingDays: '7',
        spendings: [defaultValueSpending],
      }}
    >
      <Title level={3}>Congress Budget Proposal</Title>
      <Paragraph>
        You are going to propose new budget proposal as a Congress member
      </Paragraph>
      <Form.List name="spendings" rules={[{ required: true }]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key}>
                <Form.Item
                  name={[index, 'select']}
                  label={`Transfer ${index + 1}`}
                  rules={[{ required: true }]}
                  initialValue="LLD"
                >
                  <Select
                    defaultActiveFirstOption
                    options={[
                      {
                        label: 'LLD',
                        value: 'LLD',
                      },
                      {
                        label: 'Politipool LLM',
                        value: 'POLITIPOOL_LLM',
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name={[index, 'amount']}
                  label="Amount"
                  rules={[
                    { required: true },
                    {
                      validator: (val) => {
                        try {
                          const bn = valueToBN(val);
                          if (!bn.lt(valueToBN(0))) {
                            return Promise.reject('Value must be greater than 0');
                          }
                        } catch {
                          return Promise.reject('Value must be a number');
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber controls={false} stringMode />
                </Form.Item>
                <Form.Item
                  name={[index, 'recipient']}
                  label="Recipient"
                  rules={[{ required: true }]}
                >
                  <InputSearch />
                </Form.Item>
                <RemarkForm form={form} index={index} />
                <Button red onClick={() => remove(field.name)}>
                  Remove item
                </Button>
                <Divider />
              </div>
            ))}
            <Button onClick={() => add()}>
              Add item
            </Button>
          </>
        )}
      </Form.List>
      <Form.Item
        label="Congress voting time in days"
        extra="How long will it take for congress to close this motion?"
        name="votingDays"
        rules={[
          {
            required: true,
          },
          {
            min: 1,
          },
        ]}
      >
        <InputNumber controls={false} />
      </Form.Item>
      <Paragraph>
        If motion passes in time, actual transfer will execute on block
        {' '}
        {executionBlock}
        .
      </Paragraph>
      <Flex wrap gap="15px">
        <Button onClick={closeModal}>
          Cancel
        </Button>
        <Button primary type="submit">
          Submit
        </Button>
      </Flex>
    </Form>
  );
}

ProposeBudgetModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function ProposeBudgetModalWrapper() {
  const [show, setShow] = useState();
  return (
    <>
      <Button small primary onClick={() => setShow(true)}>
        Propose budget
      </Button>
      {show && (
        <ModalRoot onClose={() => setShow(false)}>
          <ProposeBudgetModal closeModal={() => setShow(false)} />
        </ModalRoot>
      )}
    </>
  );
}

export default ProposeBudgetModalWrapper;
