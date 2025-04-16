import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import TableInternal from 'antd/es/table';
import { getDefaultPageSizes } from '../../utils/pageSize';

function Table({
  columns,
  data,
  noPagination,
  disablePagination,
  onPageChange,
  total,
  pageSize,
  showHeader,
  footer,
  title,
  simple,
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
      pagination={noPagination ? false : {
        ...getDefaultPageSizes(pageSize || 10),
        ...(total ? { total } : undefined), // Don't leave undefined key in config
        ...(simple ? { simple: { readOnly: true }, showSizeChanger: false } : undefined),
        ...(disablePagination ? { disabled: true } : undefined),
        onChange: onPageChange,
      }}
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
  onPageChange: PropTypes.func,
  pageSize: PropTypes.number,
  showHeader: PropTypes.bool,
  footer: PropTypes.node,
  title: PropTypes.node,
  total: PropTypes.number,
  simple: PropTypes.bool,
  disablePagination: PropTypes.bool,
};

export default Table;
