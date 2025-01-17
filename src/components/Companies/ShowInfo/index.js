import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../Button/Button';
import router from '../../../router';

function ShowInfo({
  registeredCompany,
}) {
  return (
    <Button href={router.companies.view.replace(':companyId', registeredCompany.id)}>
      Show info
    </Button>
  );
}

ShowInfo.propTypes = {
  registeredCompany: PropTypes.shape({
    id: PropTypes.string.isRequired,
    onlineAddresses: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ShowInfo;
