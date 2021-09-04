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
  electoral_sheet: <Button primary> Cast Vote</Button>,
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
      {title === 'All candidates' && (
        <div className={styles.headerWrapper}>
          <h3>
            {title}
          </h3>
          <div className={cx(styles.buttonWrapper, { [styles.buttonWrapperBig]: button === 'apply' })}>
            {buttons[button]}
          </div>
        </div>
      )}
      { title === 'electoral_sheet' ? (
        <>
          <Table data={data} columns={columns} {...rest} />
          { (data.length > 0)
            ? (
              <div className={cx(styles.buttonWrapper, styles.buttonWrapperBig)}>
                {buttons[title]}
              </div>
            )
            : null}
        </>
      ) : (
        <Table data={data} columns={columns} {...rest} />
      )}
    </div>
  </Card>
);

export default TableComponent;
