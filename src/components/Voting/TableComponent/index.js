/* eslint-disable react/prop-types */
import React from 'react';

import cx from 'classnames';

import Card from '../../Card';
import Button from '../../Button/Button';
import Table from '../../Table';

import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg';
import styles from './styles.module.scss';

const buttons = {
  search: <Button><SearchIcon /></Button>,
  apply: <Button primary>Apply my candidate</Button>,
};

const TableComponent = ({
  title,
  data,
  columns,
  button = 'search',
  ...rest
}) => (
  <Card>
    <div className={styles.congressionalAssembleWrapper}>
      {title && (
        <div className={styles.headerWrapper}>
          <h3>
            {title}
          </h3>
          <div className={cx(styles.buttonWrapper, { [styles.buttonWrapperBig]: button === 'apply' })}>
            {buttons[button]}
          </div>
        </div>
      )}
      <Table data={data} columns={columns} {...rest} />
    </div>
  </Card>
);

export default TableComponent;
