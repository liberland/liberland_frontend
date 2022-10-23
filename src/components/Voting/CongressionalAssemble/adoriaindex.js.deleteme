/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { userSelectors, votingSelectors } from '../../../redux/selectors';

import TableComponent from '../TableComponent';
import Status from '../../Status';
import ProgressBar from '../../ProgressBar';

import truncate from '../../../utils/truncate';

const CongressionalAssemble = () => {
  const userId = useSelector(userSelectors.selectUserId);
  const data = useSelector(votingSelectors.selectorMinistersList);

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
          : truncate(cell.row.original.deputies, 10)),
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
