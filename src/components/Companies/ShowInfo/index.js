import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Button from '../../Button/Button';
import router from '../../../router';

function ShowInfo({
  registeredCompany,
}) {
  const history = useHistory();
  const url = router.companies.view.replace(':companyId', registeredCompany.id);
  return (
    <Button
      href={url}
      onClick={() => history.push(url)}
    >
      Show info
    </Button>
  );
}

ShowInfo.propTypes = {
  registeredCompany: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

export default ShowInfo;
