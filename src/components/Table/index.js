import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import TableInternal from 'antd/es/table';

function Table({
  columns,
  data,
  noPagination,
  pageSize,
  showHeader,
  footer,
  title,
}) {
  const identityData = useMemo(() => data?.map((d, index) => ({
    ...d,
    hash: d.hash || (index + Object.values(d).map((val) => val.toString()).join('|')),
  })) || [], [data]);
  return (
    <TableInternal
      dataSource={identityData}
      rowKey="hash"
      title={title ? () => title : undefined}
      footer={footer ? () => footer : undefined}
      onRow={() => ({ tabIndex: '0' })}
      showHeader={showHeader}
      pagination={noPagination ? false : { pageSize: pageSize || 10 }}
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
  pageSize: PropTypes.number,
  showHeader: PropTypes.bool,
  footer: PropTypes.node,
  title: PropTypes.node,
};

export default Table;
