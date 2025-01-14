import React from 'react';
import Popover from 'antd/es/popover';
import PropTypes from 'prop-types';
import Button from '../../Button/Button';
import CompanyDetail from '../CompanyDetail';

function ShowInfo({
  registeredCompany,
}) {
  return (
    <Popover
      trigger={['click']}
      title="Details"
      content={<CompanyDetail mainDataObject={registeredCompany} showAll />}
    >
      <Button link>
        Show info
      </Button>
    </Popover>
  );
}

ShowInfo.propTypes = {
  registeredCompany: PropTypes.shape({
    id: PropTypes.string.isRequired,
    onlineAddresses: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ShowInfo;
