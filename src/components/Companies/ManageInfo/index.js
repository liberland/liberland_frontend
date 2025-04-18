import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import router from '../../../router';
import Button from '../../Button/Button';

function ManageInfo({
  registeredCompany,
}) {
  const history = useHistory();
  return (
    <Button
      primary
      onClick={() => history.push(`${router.companies.edit.replace(':companyId', registeredCompany.id)}#requested`)}
    >
      Manage Info
    </Button>
  );
}

ManageInfo.propTypes = {
  registeredCompany: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

export default ManageInfo;
