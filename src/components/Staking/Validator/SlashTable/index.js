import React from 'react';
import PropTypes from 'prop-types';
import Table from '../../../Table';
import { formatDollars } from '../../../../utils/walletHelpers';

function SlashTable({ slashes, title }) {
  return (
    <Table
      title={title}
      columns={[
        {
          Header: 'Slash apply era',
          accessor: 'era',
        },
        {
          Header: 'Your slash amount (as validator)',
          accessor: 'validatorSlash',
        },
        {
          Header: 'Your slash amount (as nominator)',
          accessor: 'nominatorSlash',
        },
      ]}
      data={slashes.map(({ era, validatorSlash, nominatorSlash }) => ({
        era,
        validatorSlash: `${formatDollars(validatorSlash ?? 0)} LLD`,
        nominatorSlash: `${formatDollars(nominatorSlash ?? 0)} LLD`,
      }))}
    />
  );
}

SlashTable.propTypes = {
  slashes: PropTypes.arrayOf(
    PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      era: PropTypes.any.isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      validatorSlash: PropTypes.any.isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      nominatorSlash: PropTypes.any.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default SlashTable;
