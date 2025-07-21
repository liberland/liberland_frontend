import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { useDispatch } from 'react-redux';
import { BN, isHex } from '@polkadot/util';
import Input from 'antd/es/input';
import Spin from 'antd/es/spin';
import Button from '../Button/Button';
import { parseAssets } from '../../utils/walletHelpers';
import {
  congressActions, ministryFinanceActions, senateActions, walletActions,
} from '../../redux/actions';
import InputSearch from '../InputComponents/InputSearchAddressName';
import Validator from '../../utils/validator';
import useCongressExecutionBlock from '../../hooks/useCongressExecutionBlock';
import RemarkForm from '../WalletCongresSenate/RemarkForm';
import { encodeRemark } from '../../api/nodeRpcCall';
import { OfficeType } from '../../utils/officeTypeEnum';
import modalWrapper from './components/ModalWrapper';
import OpenModalButton from './components/OpenModalButton';
import RemarkFormUser from '../Wallet/RemarkFormUser';
import { useConfirmed } from '../InputComponents/hooks';
import HookConsumer from '../../hooks/HookConsumer';
import IsConfirmed from '../InputComponents/IsConfirmed';

function SendAssetForm({
  onClose,
  assetData,
  isRemarkNeeded,
  officeType,
  readOnly,
  initialValues,
  onSuccess,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const votingDays = Form.useWatch('votingDays', form);
  const executionBlock = useCongressExecutionBlock(votingDays);
  const [isLoading, setIsLoading] = useState(false);

  const transfer = async (values) => {
    const {
      recipient, project, description, category, supplier, amountInUsd, finalDestination, combined,
    } = values;
    const amount = parseAssets(values.amount, assetData.metadata.decimals);
    if (!isRemarkNeeded) {
      dispatch(walletActions.sendAssetsTransfer.call({
        recipient,
        amount,
        assetData,
      }));
    } else if (officeType) {
      const remarkInfo = {
        project,
        description,
        category,
        supplier,
        currency: assetData.metadata.symbol,
        date: Date.now(),
        finalDestination,
        amountInUSDAtDateOfPayment: Number(amountInUsd),
      };
      const encodedRemark = await encodeRemark(remarkInfo);
      const data = {
        transferToAddress: values.recipient,
        transferAmount: amount,
        assetData,
        remarkInfo: encodedRemark,
      };
      if (officeType === OfficeType.CONGRESS) {
        dispatch(congressActions.congressSendAssets.call({ ...data, executionBlock, officeType }));
      } else if (officeType === OfficeType.SENATE) {
        dispatch(senateActions.senateSendAssets.call({ ...data, officeType }));
      } else if (officeType === OfficeType.MINISTRY_FINANCE) {
        dispatch(ministryFinanceActions.ministryFinanceSendAssets.call({ ...data, officeType }));
      }
    } else {
      dispatch(walletActions.sendTransferRemark.call({
        remarkInfo: combined,
        transferData: {
          index: assetData.index,
          balance: amount,
          recipient,
        },
      }));
    }
    onClose?.();
    onSuccess();
  };
  const { balance } = assetData.balance;
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        votingDays: 7,
        ...initialValues,
      }}
      onFinish={transfer}
    >
      <Title level={3}>
        Send
        {' '}
        {assetData.metadata.symbol}
      </Title>
      <Paragraph>
        {!isRemarkNeeded && !officeType
          ? 'You are going to send tokens from your wallet'
          : 'You are going to create spend token proposal'}
      </Paragraph>
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
          <InputSearch />
        </Form.Item>
      )}
      <Form.Item
        name="amount"
        label={`Amount ${assetData.metadata.symbol}`}
        rules={[
          { required: true },
          {
            validator: (_, textValue) => {
              if (!officeType) {
                try {
                  const validated = Validator.validateValue(
                    isHex(balance) ? new BN(balance.slice(2), 16) : new BN(balance),
                    parseAssets(textValue, assetData.metadata.decimals),
                  );
                  return validated === true ? Promise.resolve() : Promise.reject(validated);
                } catch {
                  return Promise.reject('Invalid value');
                }
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber stringMode controls={false} readOnly={readOnly} />
      </Form.Item>
      {isRemarkNeeded && (
        <>
          {!officeType ? (
            <RemarkFormUser form={form} setIsLoading={setIsLoading} readOnly={readOnly} />
          ) : (
            <RemarkForm form={form} setIsLoading={setIsLoading} />
          )}
          {officeType === 'congress' && (
            <>
              <Form.Item
                name="votingDays"
                label="Congress voting time in days"
                extra="How long will it take for congress to close the motion?"
                rules={[{ required: true }, { type: 'number', min: 1 }]}
              >
                <InputNumber controls={false} placeholder="Voting days" />
              </Form.Item>
              <Paragraph>
                If motion passes in time, actual transfer will execute on block
                {' '}
                {executionBlock}
                .
              </Paragraph>
            </>
          )}
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
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Make transfer'}
        </Button>
      </Flex>
    </Form>
  );
}

SendAssetForm.defaultProps = {
  isRemarkNeeded: false,
};

SendAssetForm.propTypes = {
  officeType: PropTypes.string,
  isRemarkNeeded: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types, react/require-default-props
  assetData: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  readOnly: PropTypes.bool,
  initialValues: PropTypes.shape({
    recipient: PropTypes.string,
    amount: PropTypes.string,
    remark: PropTypes.bool,
    id: PropTypes.string,
    description: PropTypes.string,
  }),
};

function ButtonModal(props) {
  const { assetData } = props;
  const { metadata } = assetData;

  return <OpenModalButton text={`Send ${metadata.symbol}`} {...props} />;
}

ButtonModal.propTypes = {
  assetData: PropTypes.shape({
    metadata: PropTypes.shape({
      symbol: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const SendAssetModal = modalWrapper(SendAssetForm, ButtonModal);

export default SendAssetModal;
