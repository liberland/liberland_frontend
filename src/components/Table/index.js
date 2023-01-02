import React from 'react';
import PropTypes from 'prop-types';
import { useTable } from 'react-table';

import styles from './styles.module.scss';

function Table({ columns, data, rowProps }) {
  const tableInstance = useTable({ columns, data });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <table {...getTableProps()} className={styles.table}>
      <thead className={styles.thead}>
        {
          headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))
              }
            </tr>
          ))
        }
      </thead>

      <tbody {...getTableBodyProps()} className={styles.tbody}>
        {
          rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps(rowProps(row))}>
                {
                  row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>
                      {
                        cell.render('Cell')
                      }
                    </td>
                  ))
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
}

Table.defaultProps = {
  columns: [],
  data: [],
  rowProps: () => {},
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({})),
  data: PropTypes.arrayOf(PropTypes.shape({})),
  rowProps: PropTypes.func,
};

export default Table;
