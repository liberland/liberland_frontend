import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import TableInternal from 'antd/es/table';

function Table({ columns, data }) {
  const identityData = useMemo(() => data?.map((d) => ({
    ...d,
    hash: Object.values(d).map((val) => val.toString()).join('|'),
  })) || [], [data]);
  return (
    <TableInternal
      dataSource={identityData}
      rowKey="hash"
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
