// LIBS
import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// COMPONENTS
import { useDispatch } from 'react-redux';
import { BN } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';

// STYLES
import styles from './styles.module.scss';
import { parseAssets, isValidSubstrateAddress } from '../../utils/walletHelpers';
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

// TODO add validation
function SendAssetModal({
  closeModal, assetData, isRemarkNeeded, officeType,
}) {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    watch,
    trigger,
  } = useForm({
    mode: 'all',
    defaultValues: {
      votingDays: '7',
    },
  });
  const votingDays = watch('votingDays');
  const executionBlock = useCongressExecutionBlock(votingDays);

  const transfer = async (values) => {
    if (!isValid) return;
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
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(transfer)}>
      <div className={styles.h3}>
        Send
        {' '}
        {assetData.metadata.symbol}
      </div>
      <div className={styles.description}>
        {!isRemarkNeeded
          ? 'You are going to send tokens from your wallet'
          : 'You are going to create spend token proposal'}
      </div>

      <div className={styles.title}>Send to address</div>
      <InputSearch
        trigger={trigger}
        errorTitle="Recipient"
        isRequired
        placeholder="Send to address"
        name="recipient"
        register={register}
        setValue={setValue}
        validate={((v) => {
          if (!isValidSubstrateAddress(v)) return 'Invalid Address';
          return true;
        })}
      />
      {errors?.recipient?.message
        && <div className={styles.error}>{errors.recipient.message}</div>}

      <div className={styles.title}>
        Amount
        {' '}
        {assetData.metadata.symbol}
      </div>
      <TextInput
        register={register}
        errorTitle={`Amount ${assetData.metadata.symbol}`}
        name="amount"
        validate={
          (textValue) => Validator.validateValue(
            typeof balance === 'string' ? new BN(balance.slice(2), 16) : new BN(balance),
            parseAssets(textValue, assetData.metadata.decimals),
          )
        }
        placeholder={`Amount ${assetData.metadata.symbol}`}
        required
      />
      { errors?.amount?.message
        && <div className={styles.error}>{errors.amount.message}</div> }

      {isRemarkNeeded
        && (
        <>
          <RemarkForm errors={errors} register={register} watch={watch} setValue={setValue} />

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

            <TextInput
              errorTitle="Voting days"
              register={register}
              name="votingDays"
              placeholder="Voting days"
              validate={((v) => {
                if (parseInt(v) < 1) {
                  return 'Must be at least 1 day';
                }
                return true;
              })}
              required
            />
            <div>
              If motion passes in time, actual transfer will execute on block
              {' '}
              {executionBlock}
              .
            </div>
            { errors?.votingDays?.message
        && <div className={styles.error}>{errors.votingDays.message}</div> }
          </>
          )}
        </>
        )}

      <div className={styles.buttonWrapper}>
        <Button
          medium
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          primary
          medium
          type="submit"
        >
          Make transfer
        </Button>
      </div>
    </form>
  );
}

SendAssetModal.defaultProps = {
  isRemarkNeeded: false,
};

SendAssetModal.propTypes = {
  officeType: PropTypes.string.isRequired,
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
  const [show, setShow] = React.useState(false);
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
  officeType: PropTypes.string.isRequired,
};

export default SendAssetModalWrapper;
