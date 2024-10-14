import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { contractsActions } from '../../../redux/actions';
import { TextArea } from '../../InputComponents';
import Button from '../../Button/Button';
import stylesOwn from './styles.module.scss';
import ModalRoot from '../../Modals/ModalRoot';
import styles from '../../Modals/styles.module.scss';
import InputSearch from '../../InputComponents/InputSearchAddressName';

function CreateContract({ handleModal, isMyContracts }) {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState([]);

  const {
    handleSubmit, formState: { errors }, register, setValue, trigger,
  } = useForm({
    mode: 'all',
  });

  const handleAddInput = () => {
    setInputs((prevValue) => [...prevValue, '']);
  };

  const handleDeleteInput = (index) => {
    const newInputs = [...inputs.slice(0, index), ...inputs.slice(index + 1)];
    setInputs(newInputs);
  };

  const submit = (data) => {
    const inputsData = [];
    Object.entries(data).forEach(([name, value]) => {
      if (name.includes('input')) {
        inputsData.push(value);
      }
    });
    dispatch(contractsActions.createContract.call({
      data: data.contractData,
      parties: inputsData.length > 0 ? inputsData : null,
      isMyContracts,
    }));
    handleModal();
  };

  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(submit)}
    >
      <div className={styles.h3}>Create a new Contract</div>

      <div className={styles.title}>Contract data</div>
      <TextArea
        required
        errorTitle="Contract Data"
        register={register}
        name="contractData"
      />
      { errors?.contractData?.message && <div className={styles.error}>{errors.contractData.message}</div> }

      {inputs.map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={`${index}input`}>
          <div className={styles.title}>
            Party user
            {' '}
            {index + 1}
          </div>
          <div className={stylesOwn.inputWithDelete}>
            <InputSearch
              trigger={trigger}
              errorTitle={`Input ${index + 1}`}
              isRequired
              placeholder="Write Address"
              name={`input${index}`}
              register={register}
              setValue={setValue}
              validate={(v) => {
                if (Number.isNaN(parseInt(v))) {
                  return 'Not a valid number';
                }
                if (v.length < 48) {
                  return 'Invalid decoded number length';
                }
                return true;
              }}
            />
            <Button
              className={stylesOwn.button}
              onClick={() => handleDeleteInput(index)}
              red
            >
              -
            </Button>
          </div>
          { errors[`input${index}`]?.message && <div className={styles.error}>{errors[`input${index}`].message}</div> }
        </div>
      ))}
      <div className={stylesOwn.addButtonWrapper} />

      <div className={styles.buttonWrapper}>
        <Button onClick={handleAddInput} green medium>
          + Party member
        </Button>
        <Button
          primary
          medium
          onClick={handleModal}
        >
          Cancel
        </Button>
        <Button
          primary
          medium
          type="submit"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}

CreateContract.propTypes = {
  handleModal: PropTypes.func.isRequired,
  isMyContracts: PropTypes.bool.isRequired,
};

function CreateContractModalWrapper(props) {
  return (
    <ModalRoot>
      <CreateContract {...props} />
    </ModalRoot>
  );
}

export default CreateContractModalWrapper;
