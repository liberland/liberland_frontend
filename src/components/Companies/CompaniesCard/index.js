import React from 'react';
import PropTypes from 'prop-types';
import Paragraph from 'antd/es/typography/Paragraph';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import Table from '../../Table';

import { getCompanyDetail } from '../utils';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import CompanyActions from '../CompanyActions';

function CompaniesCard({
  registries,
  type,
  hideOwner,
}) {
  return (
    <Table
      showHeader={false}
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
      ]}
      data={registries
        ?.filter((registered) => registered && !registered.invalid)
        .map((registeredCompany) => {
          const owner = getCompanyDetail('Owner (Principal)', registeredCompany, [0, 1]);
          const avatar = getCompanyDetail('Logo URL (optional)', registeredCompany);

          return {
            id: registeredCompany.id,
            name: getCompanyDetail('Company name', registeredCompany),
            mission: (
              <Paragraph ellipsis={{ expandable: true, rows: 2 }}>
                {getCompanyDetail('Purpose', registeredCompany)}
              </Paragraph>
            ),
            owner: (
              <Flex wrap gap="15px">
                {avatar && (
                  <Avatar src={avatar} />
                )}
                {owner && (
                  <CopyIconWithAddress address={owner} isTruncate />
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
