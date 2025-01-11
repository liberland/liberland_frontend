import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Card from 'antd/es/card';
import Alert from 'antd/es/alert';
import { useHistory } from 'react-router-dom';
import Button from '../../../Button/Button';
import { officesActions } from '../../../../redux/actions';
import router from '../../../../router';

function CompanyRegistration({ registration }) {
  const dispatch = useDispatch();
  const history = useHistory();

  if (!registration) {
    return null;
  }
  if (registration.invalid) {
    return (
      <Alert type="error" message="Failed to fetch registered data for this company. Maybe it contains invalid data?" />
    );
  }
  if (!registration.registration) {
    return <Alert type="error" message="Company not registered yet" />;
  }

  const unregisterCompany = (entityId) => {
    dispatch(officesActions.unregisterCompany.call({
      entityId,
      soft: false,
    }));
  };

  return (
    <Card
      title="Company data"
      cover={(
        <code>
          <pre>
            {JSON.stringify(
              registration.registration.data.toJSON(),
              null,
              2,
            )}
          </pre>
        </code>
      )}
      actions={[
        <Button
          green
          onClick={() => history.push(`${router.offices.companyRegistry.home}/edit/${registration.entity_id}`)}
        >
          Edit company data
        </Button>,
        <Button
          red
          onClick={() => unregisterCompany(registration.entity_id)}
        >
          Unregister company
        </Button>,
      ]}
    >
      Data editable by registrar:
      {' '}
      {registration.registration.editableByRegistrar.toString()}
    </Card>
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
