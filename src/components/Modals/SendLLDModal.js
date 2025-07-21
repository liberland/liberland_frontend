import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import Collapse from 'antd/es/collapse';
import InputNumber from 'antd/es/input-number';
import Input from 'antd/es/input';
import Spin from 'antd/es/spin';
import { useDispatch, useSelector } from 'react-redux';
import { BN_ZERO, BN } from '@polkadot/util';
import Button from '../Button/Button';
import InputSearch from '../InputComponents/InputSearchAddressName';
import { parseDollars, parseMerits } from '../../utils/walletHelpers';
import { walletActions } from '../../redux/actions';
import { blockchainSelectors, walletSelectors } from '../../redux/selectors';
import modalWrapper from './components/ModalWrapper';
import OpenModalButton from './components/OpenModalButton';
import RemarkFormUser from '../Wallet/RemarkFormUser';
import { IndexHelper } from '../../utils/council/councilEnum';
import { useConfirmed } from '../InputComponents/hooks';
import HookConsumer from '../../hooks/HookConsumer';
import IsConfirmed from '../InputComponents/IsConfirmed';

function SendLLDForm({
  onClose,
  onSuccess,
  initialValues,
  readOnly,
}) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const [isLoading, setIsLoading] = useState();
  const maxUnbond = balances?.liquidAmount?.amount !== '0x0'
    ? BN.max(
      BN_ZERO,
      new BN(balances?.liquidAmount?.amount ?? 0).sub(parseDollars('2')), // leave at least 2 liquid LLD...
    )
    : 0;

  const [form] = Form.useForm();
  const transfer = ({
    recipient,
    amount,
    remark,
    combined,
  }) => {
    if (remark) {
      dispatch(walletActions.sendTransferRemark.call({
        remarkInfo: combined,
        transferData: {
          index: IndexHelper.LLD,
          balance: parseDollars(amount),
          recipient,
        },
      }));
    } else {
      dispatch(
        walletActions.sendTransfer.call({
          recipient,
          amount: parseDollars(amount),
        }),
      );
    }
    onClose();
    onSuccess();
  };

  const validateUnbondValue = (_, textUnbondValue) => {
    if (userWalletAddress) { // Let users submit without wallet and then direct them to login
      try {
        const unbondValue = parseMerits(textUnbondValue);
        if (unbondValue.gt(maxUnbond)) {
          return Promise.reject('Minimum of 2 LLD must remain after transaction');
        }
        if (unbondValue.lte(BN_ZERO)) {
          return Promise.reject('Invalid amount');
        }
        return Promise.resolve();
      } catch (e) {
        return Promise.reject('Invalid amount');
      }
    }
    return Promise.resolve();
  };
  const remark = Form.useWatch('remark', form);

  return (
    <Form
      form={form}
      initialValues={initialValues}
      layout="vertical"
      onFinish={transfer}
    >
      <Title level={3}>Send LLD</Title>
      <Paragraph>You are going to send tokens from your wallet</Paragraph>
      {readOnly ? (
        <HookConsumer useHook={useConfirmed} params={{ value: initialValues.recipient }}>
          {({
            loading,
            error,
            isConfirmed,
            name,
          }) => {
            if (loading) {
              return <Spin />;
            }
            return (
              <Form.Item
                label="Send to address"
                name="recipient"
                rules={[{ required: true }]}
                extra={name}
                help={error ? 'Could not verify identity' : undefined}
              >
                <Input
                  readOnly
                  addonAfter={<IsConfirmed isConfirmed={isConfirmed} />}
                />
              </Form.Item>
            );
          }}
        </HookConsumer>
      ) : (
        <Form.Item
          label="Send to address"
          name="recipient"
          rules={[{ required: true }]}
        >
          <InputSearch placeholder="Send to address" />
        </Form.Item>
      )}
      <Form.Item
        name="amount"
        label="Amount LLD"
        rules={[
          { required: true },
          {
            validator: validateUnbondValue,
          },
        ]}
      >
        <InputNumber
          stringMode
          controls={false}
          placeholder="Amount LLD"
          readOnly={readOnly}
        />
      </Form.Item>
      <Form.Item
        name="remark"
      >
        <Collapse
          activeKey={remark ? ['remark'] : []}
          onChange={readOnly ? undefined : () => form.setFieldValue('remark', !remark)}
          destroyInactivePanel
          items={[{
            key: 'remark',
            label: remark ? 'Remark' : 'Click to include remark',
            children: (
              <RemarkFormUser
                form={form}
                setIsLoading={setIsLoading}
                readOnly={readOnly}
              />
            ),
          }]}
        />
      </Form.Item>
      <Flex wrap gap="15px">
        <Button onClick={onClose}>Cancel</Button>
        <Button primary disabled={isLoading} type="submit">
          {isLoading ? 'Loading...' : 'Make transfer'}
        </Button>
      </Flex>
    </Form>
  );
}

SendLLDForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    recipient: PropTypes.string,
    amount: PropTypes.string,
    remark: PropTypes.bool,
    id: PropTypes.string,
    description: PropTypes.string,
  }),
  onSuccess: PropTypes.func,
  readOnly: PropTypes.bool,
};

function ButtonModal(props) {
  return <OpenModalButton text="Send" {...props} />;
}

const SendLLDModal = modalWrapper(SendLLDForm, ButtonModal);

export default SendLLDModal;
