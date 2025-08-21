import React from 'react';
import PropTypes from 'prop-types';
import Table from '../../Table';
import { holder } from './types';

function TopHoldersTable({
  holders,
}) {
  return (
    <Table
      data={holders}
      columns={[
        { Header: 'Position', accessor: 'index' },
        { Header: 'Name', accessor: 'display' },
        { Header: 'Address', accessor: 'address' },
        { Header: 'Total LLD', accessor: 'total_lld_balance' },
        { Header: 'Staked LLD', accessor: 'frozen_lld_balance' },
      ]}
    />
  );
}

TopHoldersTable.propTypes = {
  holders: PropTypes.arrayOf(holder),
};

export default TopHoldersTable;
