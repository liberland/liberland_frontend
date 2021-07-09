/* eslint-disable react/prop-types */
import React from 'react';

import Card from '../../Card';
import Button from '../../Button/Button';
import Table from '../../Table';

import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg';
// import { ReactComponent as CancelIcon } from '../../../assets/icons/cancel.svg';
import styles from './styles.module.scss';

const TableComponent = ({ title, data, columns }) => (
  <Card>
    <div className={styles.congressionalAssembleWrapper}>
      {title && (
        <div className={styles.headerWrapper}>
          <h3>
            {title}
          </h3>
          <div className={styles.buttonWrapper}>
            <Button><SearchIcon /></Button>
          </div>
        </div>
      )}
      <Table data={data} columns={columns} />
    </div>
  </Card>
);

export default TableComponent;
