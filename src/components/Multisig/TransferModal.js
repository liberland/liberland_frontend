import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import Alert from 'antd/es/alert';
import Switch from 'antd/es/switch';
import Divider from 'antd/es/divider';
import Select from 'antd/es/select';
import Card from 'antd/es/card';
import notification from 'antd/es/notification';
import { BN, BN_ZERO } from '@polkadot/util';
import Button from '../Button/Button';
import InputSearch from '../InputComponents/InputSearchAddressName';
import { parseDollars, formatDollars } from '../../utils/walletHelpers';
import modalWrapper from '../Modals/components/ModalWrapper';
import OpenModalButton from '../Modals/components/OpenModalButton';
import CopyIconWithAddress from '../CopyIconWithAddress';
import {
  getBalanceByAddress,
  createMultisigTransferCallData,
  calculateMultisigTransactionFee,
  createMultisigTransfer,
} from '../../api/nodeRpcCall';

function TransferForm({
  onClose,
  onSuccess,
  initialValues,
  multisigAddress: initialMultisigAddress,
  userAddress,
  multisigData,
  userMultisigs = [],
}) {
  const [form] = Form.useForm();
  const [amount, setAmount] = useState(BN_ZERO);
  const [isProtected, setIsProtected] = useState(true);
  const [recipientId, setRecipientId] = useState(null);
  const [senderId, setSenderId] = useState(initialMultisigAddress || null);
  const [senderBalance, setSenderBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMultisig, setSelectedMultisig] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [transactionPreview, setTransactionPreview] = useState(null);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (senderId && userMultisigs.length > 0) {
      const found = userMultisigs.find((m) => m.address === senderId);
      setSelectedMultisig(found);
    }
  }, [senderId, userMultisigs]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (senderId) {
        setIsLoadingBalance(true);
        try {
          const balanceData = await getBalanceByAddress(senderId);

          const transferable = balanceData.liquidAmount?.amount
            ? new BN(balanceData.liquidAmount.amount.toString())
            : BN_ZERO;

          const total = balanceData.totalAmount?.amount
            ? new BN(balanceData.totalAmount.amount.toString())
            : BN_ZERO;

          setSenderBalance({
            accountId: senderId,
            transferable,
            availableBalance: transferable,
            totalAmount: total,
            existentialDeposit: new BN('1000000000'),
          });
        } catch (error) {
          setSenderBalance({
            accountId: senderId,
            transferable: BN_ZERO,
            availableBalance: BN_ZERO,
            totalAmount: BN_ZERO,
            existentialDeposit: new BN('1000000000'),
          });
        } finally {
          setIsLoadingBalance(false);
        }
      }
    };

    fetchBalance();
  }, [senderId]);

  const validateAmount = (_, value) => {
    try {
      const transferAmount = parseDollars(value);
      if (transferAmount.lte(BN_ZERO)) {
        return Promise.reject('Invalid amount');
      }
      if (senderBalance && transferAmount.gt(senderBalance.transferable)) {
        return Promise.reject('Amount exceeds available balance');
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.reject('Invalid amount');
    }
  };

  const handleTransfer = async (values) => {
    setIsLoading(true);

    try {
      const currentMultisigData = selectedMultisig || multisigData;
      const multisigAddress = values.sender || senderId;
      const transferAmount = parseDollars(values.amount);

      const otherSignatories = currentMultisigData.signatories.filter(
        (address) => address !== userAddress,
      );

      const callDataResult = await createMultisigTransferCallData({
        recipient: values.recipient,
        amount: transferAmount,
        isProtected,
      });

      const feeResult = await calculateMultisigTransactionFee({
        multisigAddress,
        threshold: currentMultisigData.threshold,
        otherSignatories,
        call: callDataResult.call,
        walletAddress: userAddress,
      });

      setTransactionPreview({
        multisigAddress,
        threshold: currentMultisigData.threshold,
        otherSignatories,
        recipient: values.recipient,
        amount: transferAmount,
        isProtected,
        callData: callDataResult,
        fee: feeResult,
        formValues: values,
      });

      setShowPreview(true);
    } catch (error) {
      api.error({
        message: 'Transaction Preview Failed',
        description: error.message || 'Unable to create transaction preview. Please check your inputs and try again.',
        duration: 5,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmTransaction = async () => {
    if (!transactionPreview) return;

    setIsLoading(true);

    try {
      await createMultisigTransfer({
        multisigAddress: transactionPreview.multisigAddress,
        threshold: transactionPreview.threshold,
        otherSignatories: transactionPreview.otherSignatories,
        recipient: transactionPreview.recipient,
        amount: transactionPreview.amount,
        isProtected: transactionPreview.isProtected,
        walletAddress: userAddress,
      });

      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      api.error({
        message: 'Transaction Submission Failed',
        description: error.message || 'Unable to submit the multisig transaction. Please try again.',
        duration: 5,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const multisigOptions = userMultisigs.map((multisig) => ({
    value: multisig.address,
    label: (
      <Flex align="center" gap={8}>
        <span style={{ fontWeight: 'bold' }}>{multisig.name}</span>
        <span style={{ color: '#666', fontSize: '12px' }}>
          {multisig.address.slice(0, 8)}
          ...
          {multisig.address.slice(-6)}
        </span>
        <span style={{ color: '#999', fontSize: '11px' }}>
          (
          {multisig.threshold}
          /
          {multisig.signatories.length}
          )
        </span>
      </Flex>
    ),
  }));

  if (showPreview && transactionPreview) {
    return (
      <div>
        {contextHolder}
        <Title level={3}>Transaction Preview</Title>
        <Paragraph>
          Review the transaction details before submitting to the blockchain.
        </Paragraph>

        <Alert
          message="Transaction Details"
          description={(
            <div style={{ marginTop: 8 }}>
              <p>
                <strong>From:</strong>
                {' '}
                {transactionPreview.multisigAddress}
              </p>
              <p>
                <strong>To:</strong>
                {' '}
                {transactionPreview.recipient}
              </p>
              <p>
                <strong>Amount:</strong>
                {' '}
                {formatDollars(transactionPreview.amount)}
                {' '}
                LLD
              </p>
              <p>
                <strong>Transaction Fee:</strong>
                {' '}
                {formatDollars(transactionPreview.fee?.fee)}
                {' '}
                LLD
              </p>
              <p>
                <strong>Type:</strong>
                {' '}
                {transactionPreview.isProtected ? 'Keep-Alive Transfer' : 'Normal Transfer'}
              </p>
              <p>
                <strong>Threshold:</strong>
                {' '}
                {transactionPreview.threshold}
                /
                {transactionPreview.otherSignatories.length + 1}
              </p>
            </div>
          )}
          type="info"
          style={{ marginBottom: 16 }}
        />

        <Card title="Transaction Details">
          <Flex vertical gap={16}>
            <Flex justify="space-between" align="center">
              <Paragraph strong style={{ margin: 0 }}>
                Call Data (for final call):
              </Paragraph>
              <CopyIconWithAddress
                address={transactionPreview.callData?.callData || ''}
              />
            </Flex>

            <Flex justify="space-between" align="center">
              <Paragraph strong style={{ margin: 0 }}>
                Call Hash:
              </Paragraph>
              <CopyIconWithAddress
                address={transactionPreview.callData?.callHash || ''}
              />
            </Flex>
          </Flex>
        </Card>

        <Flex wrap gap="15px" style={{ marginTop: 24 }}>
          <Button onClick={() => setShowPreview(false)}>
            Back to Form
          </Button>
          <Button
            primary
            disabled={isLoading}
            onClick={handleConfirmTransaction}
          >
            {isLoading ? 'Submitting...' : 'Submit Transaction'}
          </Button>
        </Flex>
      </div>
    );
  }

  return (
    <Form
      form={form}
      initialValues={{
        sender: initialMultisigAddress,
        ...initialValues,
      }}
      layout="vertical"
      onFinish={handleTransfer}
    >
      <Title level={3}>Create Multisig Transfer</Title>
      <Paragraph>
        Create a transfer transaction that will require approval from other multisig signatories.
      </Paragraph>

      <Form.Item
        label="Send from multisig account"
        name="sender"
        rules={[{ required: true, message: 'Please select a multisig account' }]}
      >
        <Select
          placeholder="Select multisig account"
          value={senderId}
          onChange={(value) => {
            setSenderId(value);
            form.setFieldValue('sender', value);
          }}
          options={multisigOptions}
          showSearch
          filterOption={(input, option) => {
            const multisig = userMultisigs.find((m) => m.address === option.value);
            return multisig?.name.toLowerCase().includes(input.toLowerCase())
                   || multisig?.address.toLowerCase().includes(input.toLowerCase());
          }}
        />
      </Form.Item>

      {isLoadingBalance && (
        <Alert
          message="Loading balance..."
          type="info"
          style={{ marginBottom: 16 }}
        />
      )}

      {!isLoadingBalance && senderBalance && (
        <Alert
          message={`Available: ${formatDollars(senderBalance.transferable)} LLD`}
          type="info"
          style={{ marginBottom: 16 }}
        />
      )}

      <Form.Item
        label="Send to address"
        name="recipient"
        rules={[{ required: true, message: 'Recipient address is required' }]}
      >
        <InputSearch
          placeholder="Recipient address"
          onChange={setRecipientId}
        />
      </Form.Item>

      <Form.Item
        name="amount"
        label="Amount (LLD)"
        rules={[
          { required: true, message: 'Amount is required' },
          { validator: validateAmount },
        ]}
      >
        <InputNumber
          stringMode
          controls={false}
          placeholder="Amount to transfer"
          suffix="LLD"
          style={{ width: '100%' }}
          onChange={(value) => {
            try {
              setAmount(parseDollars(value || '0'));
            } catch {
              // No-op, validation will catch it
            }
          }}
        />
      </Form.Item>

      <Alert
        message={`Existential deposit: ${(1).toFixed(4)} LLD`}
        type="info"
        style={{ marginBottom: 16 }}
      />

      <Divider />

      <Form.Item>
        <Flex vertical gap={12}>
          <Flex align="center" gap={8}>
            <Switch
              checked={isProtected}
              onChange={setIsProtected}
            />
            <span>
              {isProtected
                ? 'Transfer with account keep-alive checks'
                : 'Normal transfer without keep-alive checks'}
            </span>
          </Flex>
        </Flex>
      </Form.Item>

      <Flex wrap gap="15px">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          primary
          disabled={
            isLoading
            || isLoadingBalance
            || !amount
            || amount.lte(BN_ZERO)
            || !recipientId
          }
          type="submit"
        >
          {isLoading ? 'Creating...' : 'Create Transfer'}
        </Button>
      </Flex>
    </Form>
  );
}

TransferForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  initialValues: PropTypes.shape({
    recipient: PropTypes.string,
    amount: PropTypes.string,
  }),
  multisigAddress: PropTypes.string,
  userAddress: PropTypes.string.isRequired,
  multisigData: PropTypes.shape({
    signatories: PropTypes.arrayOf(PropTypes.string),
    threshold: PropTypes.number,
  }).isRequired,
  userMultisigs: PropTypes.arrayOf(PropTypes.shape({
    address: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    threshold: PropTypes.number.isRequired,
    signatories: PropTypes.arrayOf(PropTypes.string).isRequired,
  })),
};

function ButtonModal(props) {
  return <OpenModalButton text="Transfer" {...props} />;
}

export { TransferForm as TransferFormComponent };
export const TransferModalWithButton = modalWrapper(TransferForm, ButtonModal);

export const DirectTransferModal = modalWrapper(TransferForm);

const TransferModal = modalWrapper(TransferForm, ButtonModal);
export default TransferModal;
