import React from 'react';
import PropTypes from 'prop-types';
import Table from '../../../Table';
import styles from '../styles.module.scss';
import IdentityFlagAnalysis from '../IdentityFlagAnalysis';
import EligibleOnAnalysis from '../EligibleOnAnalysis';

function IdentityAnalysis({ identity }) {
  return (
    <Table
      columns={[
        {
          Header: 'Citizenship eligibility analysis',
          accessor: 'desc',
        },
        {
          Header: '',
          accessor: 'res',
        },
      ]}
      data={[
        {
          desc: 'E-resident identity field',
          res: <IdentityFlagAnalysis identity={identity} field="eresident" />,
        },
        {
          desc: 'Citizen identity field',
          res: <IdentityFlagAnalysis identity={identity} field="citizen" />,
        },
        {
          desc: (
            <>
              Age check
              <span className={styles.monospace}>eligible_on</span>
            </>
          ),
          res: <EligibleOnAnalysis identity={identity} />,
        },
      ]}
    />
  );
}

IdentityAnalysis.propTypes = {
  identity: PropTypes.instanceOf(Map).isRequired,
};

export default IdentityAnalysis;
