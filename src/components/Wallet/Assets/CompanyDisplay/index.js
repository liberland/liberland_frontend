import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Link from 'antd/es/typography/Link';
import truncate from '../../../../utils/truncate';
import CompanyImage from '../CompanyImage';
import router from '../../../../router';
import { useIsConnected } from '../../hooks';

export default function CompanyDetail({
  id,
  name,
  logo,
  size,
  asset,
}) {
  const isConnected = useIsConnected({
    asset,
    companyId: id,
  });
  return (
    <Flex wrap gap="7px" align="center">
      <CompanyImage
        id={id}
        size={size}
        logo={logo}
        name={name}
      />
      <Flex vertical gap="7px">
        <Link href={router.companies.view.replace(':companyId', id)}>
          {truncate(name || id || 'Unknown', 15)}
        </Link>
        {!isConnected && (
          <div className="description">
            Not connected
          </div>
        )}
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
  asset: PropTypes.number.isRequired,
};
