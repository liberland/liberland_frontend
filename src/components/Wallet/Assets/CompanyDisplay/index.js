import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Link from 'antd/es/typography/Link';
import { useSelector } from 'react-redux';
import truncate from '../../../../utils/truncate';
import CompanyImage from '../CompanyImage';
import { registriesSelectors } from '../../../../redux/selectors';
import router from '../../../../router';

export default function CompanyDetail({
  id,
  name,
  logo,
  size,
  asset,
}) {
  const registries = useSelector(registriesSelectors.registries);
  const allRegistries = useSelector(registriesSelectors.allRegistries);
  const company = allRegistries.officialRegistryEntries?.find((item) => item.id === id);
  const request = registries?.officialUserRegistryEntries?.companies?.requested?.find((item) => item.id === id);
  const isConnected = company?.relevantAssets?.find(({ assetId }) => assetId?.value?.toString() === asset?.toString())
    || request?.relevantAssets?.find(({ assetId }) => assetId?.value?.toString() === asset?.toString());

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
