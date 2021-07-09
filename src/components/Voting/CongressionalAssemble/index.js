/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';

import Button from '../../Button/Button';
import TableComponent from '../TableComponent';

import { ReactComponent as CancelIcon } from '../../../assets/icons/cancel.svg';

const CongressionalAssemble = () => {
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

  return <TableComponent title="Current assembly" data={data} columns={columns} />;
};

export default CongressionalAssemble;
