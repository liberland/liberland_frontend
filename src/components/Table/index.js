import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import TableInternal from 'antd/es/table';

function Table({
  columns,
  data,
  noPagination,
  showHeader,
  footer,
  title,
}) {
  const identityData = useMemo(() => data?.map((d) => ({
    ...d,
    hash: d.hash || Object.values(d).map((val) => val.toString()).join('|'),
  })) || [], [data]);
  return (
    <TableInternal
      dataSource={identityData}
      rowKey="hash"
      title={() => title}
      footer={() => footer}
      onRow={() => ({ tabIndex: '0' })}
      showHeader={showHeader}
      pagination={noPagination ? false : undefined}
      columns={columns.filter(Boolean).map(({ Header, accessor }) => ({
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
  noPagination: PropTypes.bool,
  showHeader: PropTypes.bool,
  footer: PropTypes.node,
  title: PropTypes.node,
};

export default Table;
