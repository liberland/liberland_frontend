import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import { TextInput } from '../../InputComponents';
import Button from '../../Button/Button';
import { officesActions } from '../../../redux/actions';
import { officesSelectors, blockchainSelectors } from '../../../redux/selectors';
import styles from './styles.module.scss';

function CompanyForm() {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
  } = useForm();

  const onSubmit = ({ entity_id }) => {
    dispatch(officesActions.getCompanyRequest.call(entity_id));
    dispatch(officesActions.getCompanyRegistration.call(entity_id));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.h3}>Verify company registration request</div>

      <TextInput
        register={register}
        name="entity_id"
        placeholder="Company ID"
        required
      />

      <div className={styles.buttonWrapper}>
        <Button
          primary
          medium
          type="submit"
        >
          Fetch data
        </Button>
      </div>
    </form>
  );
}

function MissingRequest() {
  return 'This company doesn\'t exist or has no pending registration requests.';
}

function CompanyRegistration({ registration }) {
  if (registration === null) return null;
  let data = registration.registration;
  if (data === null) return null;
  if (data.isNone) return <div>Company not registered yet</div>;
  data = data.unwrap();
  return <div>
      Company data: <pre>{data.data.toUtf8()}</pre>
      Data editable by registrar: {data.editableByRegistrar.toString()}
  </div>;
}

function CompanyRequest({ request }) {
  const dispatch = useDispatch();
  const sender = useSelector(blockchainSelectors.userWalletAddressSelector);
  if (request === null) return null;
  const { entity_id } = request;
  let data = request.request;
  if (data === null) return null;
  if (data.isNone) return <MissingRequest />;

  data = data.unwrap();
  const { hash } = data.data;

  const onClick = () => {
    dispatch(officesActions.registerCompany.call({
      walletAddress: sender,
      entity_id,
      hash,
    }));
  };

  return (
    <>
      Company data: <pre>{data.data.toUtf8()}</pre>
      Data editable by registrar: {data.editableByRegistrar.toString()}

      <div className={styles.buttonWrapper}>
        <Button
          primary
          medium
          onClick={onClick}
        >
          Register company
        </Button>
      </div>
    </>
  );
}

function CompanyRegistry() {
  const request = useSelector(officesSelectors.selectorCompanyRequest);
  const registration = useSelector(officesSelectors.selectorCompanyRegistration);
  return (
    <>
      <CompanyForm />
      { registration && <>
        <div className={styles.h4}>Currently registered data:</div>
        <CompanyRegistration registration={registration} />
      </>}
      { request && <>
        <div className={styles.h4}>Request:</div>
        <CompanyRequest request={request} />
      </>}
    </>
  );
}

export default CompanyRegistry;
