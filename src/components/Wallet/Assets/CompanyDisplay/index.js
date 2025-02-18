import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import truncate from '../../../../utils/truncate';
import CompanyImage from '../CompanyImage';

export default function CompanyDetail({
  id,
  name,
  logo,
  size,
}) {
  return (
    <Flex wrap gap="7px" align="center">
      <CompanyImage
        id={id}
        size={size}
        logo={logo}
        name={name}
      />
      <Flex vertical gap="7px">
        <strong>
          {truncate(name || id || 'Unknown', 15)}
        </strong>
        <div className="description">
          ID:
          {' '}
          {id || 'Unknown'}
        </div>
      </Flex>
    </Flex>
  );
}

CompanyDetail.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  logo: PropTypes.string,
  size: PropTypes.number.isRequired,
};
