/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../../redux/selectors/userSelectors';

import TableComponent from '../TableComponent';
import Status from '../../Status';
import ProgressBar from '../../ProgressBar';

const CongressionalAssemble = () => {
  const userId = useSelector(selectUserId);
  const data = useMemo(
    () => [
      {
        id: '4',
        place: '#1',
        deputies: 'John Wayne',
        supported: '10.000 LLM',
        power: '100',
      },
      {
        id: '2',
        place: '#2',
        deputies: 'Latisha Peacock',
        supported: '9.000 LLM',
        power: '70',
      },
      {
        id: '1',
        place: '#3',
        deputies: 'Vernon Leonard',
        supported: '8.000 LLM',
        power: '40',
      },
      {
        id: '4',
        place: '#4',
        deputies: 'Guto Callaghan',
        supported: '7.000 LLM',
        power: '20',
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
        Cell: ({ cell }) => (cell.row.original.id === `${userId}`
          ? (
            <>
              {' '}
              {cell.row.original.deputies}
              {' '}
              <Status status="Your candidate" pending />
              {' '}
            </>
          )
          : cell.row.original.deputies),
      },
      {
        Header: 'SUPPORTED',
        accessor: 'supported',
      },
      {
        Header: 'POWER',
        accessor: 'power',
        Cell: ({ cell }) => (
          <ProgressBar percent={cell.row.original.power} />
        ),
      },
    ],
    [userId],
  );

  const rowProps = (row) => {
    if (row.original.id === `${userId}`) {
      return {
        style: {
          boxShadow: '0 0 0 1px #F1C823',
        },
      };
    }
    return {};
  };
  return <TableComponent title="Current assembly" data={data} columns={columns} rowProps={rowProps} />;
};

export default CongressionalAssemble;
