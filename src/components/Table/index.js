import React from 'react';
import PropTypes from 'prop-types';
import TableInternal from 'antd/es/table';

function Table({ columns, data }) {
  return (
    <TableInternal
      dataSource={data}
      columns={columns.map(({ Header, accessor }) => ({
        dataIndex: accessor,
        key: accessor,
        title: Header,
      }))}
    />
  );
}

Table.defaultProps = {
  columns: [],
  data: [],
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({})),
  data: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Table;
