import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import InputNumber from 'antd/es/input-number';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { useDispatch } from 'react-redux';
import { BN } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import { parseAssets } from '../../utils/walletHelpers';
import {
  congressActions, ministryFinanceActions, senateActions, walletActions,
} from '../../redux/actions';
import InputSearch from '../InputComponents/InputSearchAddressName';
import Validator from '../../utils/validator';
import useCongressExecutionBlock from '../../hooks/useCongressExecutionBlock';
import RemarkForm from '../WalletCongresSenate/RemarkForm';
import { encodeRemark } from '../../api/nodeRpcCall';
import ButtonArrowIcon from '../../assets/icons/button-arrow.svg';
import { OfficeType } from '../../utils/officeTypeEnum';

function SendAssetModal({
  closeModal, assetData, isRemarkNeeded, officeType,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const votingDays = Form.useWatch('votingDays', form);
  const executionBlock = useCongressExecutionBlock(votingDays);

  const transfer = async (values) => {
    const {
      recipient, project, description, category, supplier, amountInUsd, finalDestination,
    } = values;
    const amount = parseAssets(values.amount, assetData.metadata.decimals);
    if (!isRemarkNeeded) {
      dispatch(walletActions.sendAssetsTransfer.call({
        recipient,
        amount,
        assetData,
      }));
    } else {
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
    }
    closeModal();
  };
  const { balance } = assetData.balance;
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        votingDays: '7',
      }}
      onFinish={transfer}
    >
      <Title level={3}>
        Send
        {' '}
        {assetData.metadata.symbol}
      </Title>
      <Paragraph>
        {!isRemarkNeeded
          ? 'You are going to send tokens from your wallet'
          : 'You are going to create spend token proposal'}
      </Paragraph>

      <Form.Item
        label="Send to address"
        name="recipient"
        rules={[{ required: true }]}
      >
        <InputSearch />
      </Form.Item>
      <Form.Item
        name="amount"
        label={`Amount ${assetData.metadata.symbol}`}
        rules={[
          { required: true },
          {
            validator: (_, textValue) => {
              try {
                return Validator.validateValue(
                  typeof balance === 'string' ? new BN(balance.slice(2), 16) : new BN(balance),
                  parseAssets(textValue, assetData.metadata.decimals),
                ) ? Promise.resolve : Promise.reject('Invalid number');
              } catch {
                return Promise.reject('Invalid value');
              }
            },
          },
        ]}
      >
        <InputNumber stringMode controls={false} />
      </Form.Item>
      <div className={styles.title}>
        Amount
        {' '}
        {assetData.metadata.symbol}
      </div>
      {isRemarkNeeded && (
        <>
          <RemarkForm form={form} />

          {officeType === 'congress' && (
            <>
              <div className={styles.title}>
                Congress
                {' '}
                voting time in days
              </div>
              <div className={styles.description}>
                How long will it take
                {' '}
                Congress
                {' '}
                to close the motion?
              </div>
              <Form.Item
                name="votingDays"
                label="Congress voting time in days"
                extra="How long will it take for congress to close the motion?"
                rules={[{ required: true }, { min: 1 }]}
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
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          primary
          type="submit"
        >
          Make transfer
        </Button>
      </Flex>
    </Form>
  );
}

SendAssetModal.defaultProps = {
  isRemarkNeeded: false,
};

SendAssetModal.propTypes = {
  officeType: PropTypes.string,
  isRemarkNeeded: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types, react/require-default-props
  assetData: PropTypes.any,
  closeModal: PropTypes.func.isRequired,
};

function SendAssetModalWrapper({
  isRemarkNeeded,
  assetData,
  officeType,
}) {
  const [show, setShow] = useState(false);
  return (
    <>
      <Button
        className={styles.button}
        onClick={() => setShow(true)}
      >
        Send
        {' '}
        {assetData.metadata.symbol}
        <img src={ButtonArrowIcon} className={styles.arrowIcon} alt="button icon" />
      </Button>
      {show && (
        <ModalRoot>
          <SendAssetModal
            closeModal={() => setShow(false)}
            assetData={assetData}
            isRemarkNeeded={isRemarkNeeded}
            officeType={officeType}
          />
        </ModalRoot>
      )}
    </>
  );
}

SendAssetModalWrapper.propTypes = {
  isRemarkNeeded: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types, react/require-default-props
  assetData: PropTypes.any,
  officeType: PropTypes.string,
};

export default SendAssetModalWrapper;
