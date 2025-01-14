import React from 'react';
import Dropdown from 'antd/es/dropdown';
import Flex from 'antd/es/flex';
import Button from 'antd/es/button';
import Space from 'antd/es/space';
import DownOutlined from '@ant-design/icons/DownOutlined';
import PropTypes from 'prop-types';
import { sortByMap } from './utils';
import styles from './styles.module.scss';

function ExchangeSort({
  onSort,
  sortBy,
}) {
  return (
    <Flex align="center" justify="center" gap="15px" onClick={(e) => e.stopPropagation()}>
      <span className={styles.description}>
        Sort
      </span>
      <Dropdown
        menu={{
          items: Object.keys(sortByMap).map((key) => ({
            key,
            label: key,
          })),
          onClick: ({ key }) => {
            onSort(key);
          },
        }}
        trigger={['click']}
      >
        <Button>
          <Space>
            {sortBy}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </Flex>
  );
}

ExchangeSort.propTypes = {
  onSort: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
};

export default ExchangeSort;
