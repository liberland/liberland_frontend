import React from 'react';
import Dropdown from 'antd/es/dropdown';
import PropTypes from 'prop-types';
import { sortByMap } from './utils';
import styles from './styles.module.scss';

function ExchangeSort({
  onSort,
  sortBy,
}) {
  return (
    <>
      <span className={styles.description}>
        Sort
      </span>
      <Dropdown.Button
        menu={{
          items: Object.keys(sortByMap).map((key) => ({
            key,
            label: key,
          })),
          onClick: ({ key }) => {
            onSort(key);
          },
        }}
      >
        {sortBy}
      </Dropdown.Button>
    </>
  );
}

ExchangeSort.propTypes = {
  onSort: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
};

export default ExchangeSort;
