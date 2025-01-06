import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Button from '../../../Button/Button';
import styles from '../styles.module.scss';
import { officesActions } from '../../../../redux/actions';
import router from '../../../../router';

function CompanyRegistration({ registration }) {
  const dispatch = useDispatch();

  if (!registration) return null;
  if (registration.invalid) {
    return (
      <>
        Failed to fetch registered data for this company. Maybe it contains invalid data?
      </>
    );
  }
  if (!registration.registration) return <div>Company not registered yet</div>;

  const unregisterCompany = (entityId) => {
    dispatch(officesActions.unregisterCompany.call({
      entityId,
      soft: false,
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
        {registration.registration.editableByRegistrar.isTrue && (
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
        )}
        <Button
          primary
          medium
          red
          onClick={() => unregisterCompany(registration.entity_id)}
        >
          Unregister company
        </Button>
      </div>
    </div>
  );
}

CompanyRegistration.propTypes = {
  registration: PropTypes.shape({
    invalid: PropTypes.bool,
    entity_id: PropTypes.string.isRequired,
    registration: PropTypes.shape({
      editableByRegistrar: PropTypes.bool.isRequired,
      hash: PropTypes.arrayOf(PropTypes.number).isRequired,
      data: PropTypes.instanceOf(Map).isRequired,
    }),
  }).isRequired,
};

export default CompanyRegistration;
