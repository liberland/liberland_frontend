// LIBS
import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// COMPONENTS
import { useDispatch } from 'react-redux';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';

// STYLES
import styles from './styles.module.scss';
import { parseAssets, isValidSubstrateAddress } from '../../utils/walletHelpers';
import { congressActions } from '../../redux/actions';
import InputSearch from '../InputComponents/InputSearchAddressName';
import useCongressExecutionBlock from '../../hooks/useCongressExecutionBlock';

// TODO add validation
function SpendAssetModal({ closeModal, assetData }) {
  const dispatch = useDispatch();

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    watch,
  } = useForm({
    mode: 'all',
    defaultValues: {
      votingDays: '7',
    },
  });
  const votingDays = watch('votingDays');
  const executionBlock = useCongressExecutionBlock(votingDays);

  const transfer = (values) => {
    dispatch(congressActions.congressSendAssets.call({
      transferToAddress: values.recipient,
      transferAmount: parseAssets(values.amount, assetData.metadata.decimals),
      assetData,
      remarkInfo: values.description || `Congress spend ${assetData.metadata.name} (${assetData.metadata.symbol})`,
      executionBlock,
    }));
    closeModal();
  };

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(transfer)}>
      <div className={styles.h3}>
        Spend
        {' '}
        {assetData.metadata.symbol}
      </div>
      <div className={styles.description}>
        You are going to create spend token proposal
      </div>

      <div className={styles.title}>Spend to address</div>
      <InputSearch
        errorTitle="Recipient"
        isRequired
        placeholder="Spend to address"
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
        {assetData.metadata.name}
        {' '}
        (
        {assetData.metadata.symbol}
        )
      </div>
      <TextInput
        register={register}
        name="amount"
        placeholder={`Amount ${assetData.metadata.name} (${assetData.metadata.symbol})`}
        required
      />
      { errors?.amount?.message
        && <div className={styles.error}>{errors.amount.message}</div> }

      <div className={styles.title}>Spend description</div>
      <TextInput
        register={register}
        minLength={{ value: 3, message: 'Min description length is 3 chars' }}
        maxLength={{ value: 256, message: 'Max description length is 256 chars' }}
        name="description"
        placeholder="Spend description"
        required
      />
      { errors?.description?.message
        && <div className={styles.error}>{errors.description.message}</div> }

      <div className={styles.title}>Congress voting time in days</div>
      <div className={styles.description}>How long will it take Congress to close the motion?</div>
      <TextInput
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
        {executionBlock}
        .
      </div>
      { errors?.votingDays?.message
        && <div className={styles.error}>{errors.votingDays.message}</div> }

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

SpendAssetModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types, react/require-default-props
  assetData: PropTypes.any,
};

function SpendAssetModalWrapper(props) {
  return (
    <ModalRoot>
      <SpendAssetModal {...props} />
    </ModalRoot>
  );
}

export default SpendAssetModalWrapper;
