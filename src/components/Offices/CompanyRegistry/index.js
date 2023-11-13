import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { ReactComponent as CancelIcon } from '../../../assets/icons/cancel.svg';
import { ReactComponent as OkIcon } from '../../../assets/icons/green-check.svg';

import { TextInput } from '../../InputComponents';
import Button from '../../Button/Button';
import { officesActions } from '../../../redux/actions';
import { officesSelectors, blockchainSelectors } from '../../../redux/selectors';
import styles from './styles.module.scss';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import router from '../../../router';

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

function InvalidRequest() {
  return 'Failed to fetch pending registration requests for this company. Maybe it contains invalid data?';
}

function InvalidRegistration() {
  return 'Failed to fetch registered data for this company. Maybe it contains invalid data?';
}

function CompanyRegistration({ registration }) {
  const dispatch = useDispatch();
  if (!registration) return null;
  if (registration.invalid) return <InvalidRegistration />;
  if (!registration.registration) return <div>Company not registered yet</div>;
  const unregister = () => {
    dispatch(officesActions.unregisterCompany.call({
      companyId: registration.entity_id,
    }));
  };
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
      <div className={styles.buttonWrapper}>
        {registration.registration.editableByRegistrar.isTrue && 
          <NavLink
            to={`${router.offices.companyRegistry.home}/edit/${registration.entity_id}`}
          >
            <Button
              primary
              green
              medium
            >
              <h3>Edit company data</h3>
            </Button>
          </NavLink>
        }
        <Button primary medium red onClick={unregister}>
          Unregister company
        </Button>
      </div>
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
  if (request.invalid) return <InvalidRequest />;
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
      {editableByRegistrar.isTrue ? <OkIcon /> : <CancelIcon />}
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
