import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

// COMPONENTS
import { useDispatch, useSelector } from 'react-redux';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import { SelectInput, TextInput } from '../InputComponents';
import { congressActions } from '../../redux/actions';
import { congressSelectors } from '../../redux/selectors';
import { isValidSubstrateAddress } from '../../utils/walletHelpers';
import { closestNumberToZeroNotInArray, extractItemsFromObject } from '../../utils/council/councilHelper';
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

const collectDataItemList = [
  'project',
  'description',
  'recipient',
  'transfer',
  'select',
  'category',
  'supplier',
  'combined',
  'finalDestination',
];

function ProposeBudgetModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const allBalance = useSelector(congressSelectors.allBalance);
  const [itemsInList, setItemsInList] = useState([0]);
  const [spendings, setSpendings] = useState([defaultValueSpending]);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid },
    watch,
    unregister,
    trigger,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      votingDays: '7',
    },
  });

  const executionBlock = useCongressExecutionBlock(7);

  const onSubmit = async (data) => {
    if (!isValid) return;
    const bugetProposalItems = await extractItemsFromObject(data, spendings[0].optionsInput);
    dispatch(congressActions.congressBudgetPropose.call({ bugetProposalItems, executionBlock }));
    closeModal();
  };

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

  const handleAddInput = () => {
    const newItemCounter = closestNumberToZeroNotInArray(itemsInList);
    setItemsInList((prevValue) => [...prevValue, newItemCounter]);
    setSpendings((oldValue) => [
      ...oldValue, { ...defaultValueSpending, optionsInput: optionsInputDefault, indexItem: newItemCounter },
    ]);
  };

  const handleDeleteInput = (index, indexItem) => {
    collectDataItemList.map((item) => unregister(`${item}${indexItem}`));

    setSpendings((oldValue) => {
      const newItems = [...oldValue];
      newItems.splice(index, 1);
      return newItems;
    });
    setItemsInList((prevValue) => prevValue.filter((item) => item !== indexItem));
  };

  useEffect(() => {
    setSpendings([{ ...defaultValueSpending, optionsInput: optionsInputDefault }]);
  }, [optionsInputDefault]);

  useEffect(() => {
    dispatch(congressActions.getAllBalanceForCongress.call({ isLlmNeeded: true }));
  }, [dispatch]);

  if (!optionsInputDefault) return null;

  return (
    <form
      className={styles.getCitizenshipModal}
      style={{ width: '90%' }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.h3}>Congress Budget Proposal</div>
      <div className={styles.description}>
        You are going to propose new budget proposal as a Congress member
      </div>
      {spendings.map(({ optionsInput, indexItem }, index) => ( // eslint-disable-next-line react/no-array-index-key
        <div key={`${index}-${indexItem}`}>
          <div className={styles.title}>
            Transfer
            {' '}
            {indexItem + 1}
            <SelectInput
              register={register}
              options={optionsInput}
              name={`select${indexItem}`}
              selected="LLD"
            />
          </div>

          <div className={styles.title}>Amount</div>
          <TextInput
            register={register}
            name={`transfer${indexItem}`}
            errorTitle="Amount"
            placeholder="Amount"
            required
            validate={(value) => {
              if (Number.isNaN(Number(value))) return 'Not a number';
              return true;
            }}
          />
          {errors?.[`transfer${indexItem}`]
            && <div className={styles.error}>{errors[`transfer${indexItem}`].message}</div>}

          <div className={styles.title}>Recipient</div>
          <InputSearch
            errorTitle={`Recipient ${indexItem + 1}`}
            register={register}
            name={`recipient${indexItem}`}
            placeholder="Recipient"
            isRequired
            trigger={trigger}
            setValue={setValue}
            validate={(v) => {
              if (!isValidSubstrateAddress(v)) return 'Invalid Address';
              return true;
            }}
          />
          {errors[`recipient${indexItem}`]?.message
          && <div className={styles.error}>{errors[`recipient${indexItem}`].message}</div>}

          <RemarkForm
            indexItem={indexItem}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
          />

          <div className={styles.buttonWrapper}>
            {spendings.length > 1
              && (
              <Button
                className={styles.button}
                onClick={() => handleDeleteInput(index, indexItem)}
                red
              >
                Delete Spending
              </Button>
              )}
            {index === spendings.length - 1 && (
              <Button className={styles.button} medium green onClick={() => handleAddInput()}>
                Add new spending
              </Button>
            )}
          </div>
        </div>
      ))}

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

      <div className={styles.buttonWrapper}>
        <Button className={styles.button} medium onClick={closeModal}>
          Cancel
        </Button>
        <Button className={styles.button} medium primary type="submit">
          Submit
        </Button>
      </div>

    </form>
  );
}

ProposeBudgetModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function ProposeBudgetModalWrapper(props) {
  return (
    <ModalRoot>
      <ProposeBudgetModal {...props} />
    </ModalRoot>
  );
}

export default ProposeBudgetModalWrapper;
