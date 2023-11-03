import React from 'react';
import PropTypes from 'prop-types';
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
  if (!registration) return null;
  if (!registration.registration) return <div>Company not registered yet</div>;
  return (
    <div>
      Company data:
      <code>
        <pre>
          {JSON.stringify(
            registration.registration.data.toJSON(),
            null,
            2,
          )}
        </pre>
      </code>
      Data editable by registrar:
      {' '}
      {registration.registration.editableByRegistrar.toString()}
    </div>
  );
}

CompanyRegistration.propTypes = {
  registration: PropTypes.shape({
    entity_id: PropTypes.string.isRequired,
    registration: PropTypes.shape({
      editableByRegistrar: PropTypes.bool.isRequired,
      hash: PropTypes.arrayOf(PropTypes.number).isRequired,
      data: PropTypes.instanceOf(Map).isRequired,
    }),
  }).isRequired,
};

function CompanyRequest({ request }) {
  const dispatch = useDispatch();
  const sender = useSelector(blockchainSelectors.userWalletAddressSelector);
  if (!request) return null;
  const { entity_id } = request;
  if (!request.request) return <MissingRequest />;
  const { hash, data, editableByRegistrar } = request.request;

  const onClick = () => {
    dispatch(officesActions.registerCompany.call({
      walletAddress: sender,
      entity_id,
      hash,
    }));
  };

  return (
    <>
      Company data:
      <code>
        <pre>
          {JSON.stringify(
            data.toJSON(),
            null,
            2,
          )}
        </pre>
      </code>
      Data editable by registrar:
      {' '}
      {editableByRegistrar.toString()}
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

CompanyRequest.propTypes = {
  request: PropTypes.shape({
    entity_id: PropTypes.string.isRequired,
    request: PropTypes.shape({
      editableByRegistrar: PropTypes.bool.isRequired,
      hash: PropTypes.arrayOf(PropTypes.number).isRequired,
      data: PropTypes.instanceOf(Map).isRequired,
    }),
  }).isRequired,
};

function CompanyRegistry() {
  const request = useSelector(officesSelectors.selectorCompanyRequest);
  const registration = useSelector(officesSelectors.selectorCompanyRegistration);
  return (
    <>
      <CompanyForm />
      { registration && (
      <>
        <div className={styles.h4}>Currently registered data:</div>
        <CompanyRegistration registration={registration} />
      </>
      )}
      { request && (
      <>
        <div className={styles.h4}>Request:</div>
        <CompanyRequest request={request} />
      </>
      )}
    </>
  );
}

export default CompanyRegistry;
