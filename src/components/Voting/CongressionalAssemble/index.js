/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';

import Card from '../../Card';
import Button from '../../Button/Button';
import Table from '../../Table';

import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg';
import { ReactComponent as CancelIcon } from '../../../assets/icons/cancel.svg';
import styles from './styles.module.scss';

const CongressionalAssemble = ({ title }) => {
  const data = useMemo(
    () => [
      {
        id: '1',
        place: '#1',
        deputies: 'John Wayne',
        totalStaked: '10.000 LLM',
        youStaked: '',
        action: 'Stake',
      },
      {
        id: '2',
        place: '#2',
        deputies: 'Latisha Peacock',
        totalStaked: '9.000 LLM',
        youStaked: '6.000 LLM',
        action: 'Stake',
      },
      {
        id: '3',
        place: '#3',
        deputies: 'Vernon Leonard',
        totalStaked: '8.000 LLM',
        youStaked: '4.000 LLM',
        action: 'Stake',
      },
      {
        id: '4',
        place: '#4',
        deputies: 'Guto Callaghan',
        totalStaked: '7.000 LLM',
        youStaked: '2.000 LLM',
        action: 'Stake',
      },
    ],
    [],
  );

  const columns = useMemo(
    () => [
      {
        Header: 'PLACE',
        accessor: 'place',
      },
      {
        Header: 'DEPUTIES',
        accessor: 'deputies',
      },
      {
        Header: 'TOTAL STAKED',
        accessor: 'totalStaked',
      },
      {
        Header: 'YOU STAKED',
        accessor: 'youStaked',
        Cell: ({ cell }) => {
          if (cell.row.values.youStaked) {
            return (
              <>
                {cell.row.values.youStaked}
                {' '}
                <CancelIcon />
              </>
            );
          }
          return '—';
        },
      },
      {
        Header: 'ACTIONS',
        accessor: 'action',
        Cell: ({ cell }) => (
          <Button green value={cell.row.original.id} onClick={() => { }}>
            {cell.row.original.action}
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <Card>
      <div className={styles.congressionalAssembleWrapper}>
        <div className={styles.headerWrapper}>
          <h3>
            {title}
          </h3>
          <div className={styles.buttonWrapper}>
            <Button><SearchIcon /></Button>
          </div>
        </div>
        <Table data={data} columns={columns} />
      </div>
    </Card>
  );
};

export default CongressionalAssemble;
