import React from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import Table from '../../../Table';

function TokenTable({ backendMerits, backendDollars }) {
  return (
    <Table
      columns={[
        {
          Header: 'User balance in centralized database',
          accessor: 'desc',
        },
        {
          Header: '',
          accessor: 'res',
        },
      ]}
      data={[
        {
          desc: 'LLM ICM balance',
          res: backendMerits ? ethers.utils.formatUnits(backendMerits, 12) : 0,
        },
        {
          desc: 'LLD ICM balance',
          res: backendDollars ? ethers.utils.formatUnits(backendDollars, 12) : 0,
        },
      ]}
    />
  );
}

TokenTable.propTypes = {
  backendMerits: PropTypes.instanceOf(ethers.BigNumber).isRequired,
  backendDollars: PropTypes.instanceOf(ethers.BigNumber).isRequired,
};

export default TokenTable;
