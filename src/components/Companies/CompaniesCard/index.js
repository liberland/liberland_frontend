import React from 'react';
import PropTypes from 'prop-types';
import Paragraph from 'antd/es/typography/Paragraph';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import Table from '../../Table';

import CopyIconWithAddress from '../../CopyIconWithAddress';
import CompanyActions from '../CompanyActions';

function CompaniesCard({
  registries,
  type,
  hideOwner,
}) {
  return (
    <Table
      columns={[
        {
          Header: 'ID',
          accessor: 'id',
        },
        {
          Header: 'Company name',
          accessor: 'name',
        },
        {
          Header: 'Mission',
          accessor: 'mission',
        },
        !hideOwner && {
          Header: 'Owner',
          accessor: 'owner',
        },
        {
          Header: 'Actions',
          accessor: 'actions',
        },
      ].filter(Boolean)}
      data={registries
        ?.filter((registered) => registered && !registered.invalid)
        .map((registeredCompany) => {
          const owner = registeredCompany.principals?.[0]?.name?.value;
          const address = registeredCompany.principals?.[0]?.walletAddress?.value;
          const avatar = registeredCompany.logoURL;

          return {
            id: registeredCompany.id,
            name: registeredCompany.name,
            mission: (
              <Paragraph ellipsis={{ expandable: true, rows: 2 }}>
                {registeredCompany.purpose}
              </Paragraph>
            ),
            owner: (
              <Flex wrap gap="15px">
                {avatar && (
                  <Avatar src={avatar} />
                )}
                {owner && (
                  <CopyIconWithAddress name={owner} address={address} isTruncate />
                )}
              </Flex>
            ),
            actions: <CompanyActions registeredCompany={registeredCompany} type={type} />,
          };
        }) || {}}
    />
  );
}

CompaniesCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  registries: PropTypes.array.isRequired,
  type: PropTypes.oneOf(['requested', 'mine', 'all']),
  hideOwner: PropTypes.bool,
};

export default CompaniesCard;
