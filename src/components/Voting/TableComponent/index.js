/* eslint-disable react/prop-types */
import React from 'react';
import { web3Accounts } from '@polkadot/extension-dapp';

import cx from 'classnames';

import Card from '../../Card';
import Button from '../../Button/Button';
import Table from '../../Table';

import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg';
import styles from './styles.module.scss';

const { ApiPromise, WsProvider } = require('@polkadot/api');

const provider = new WsProvider(process.env.REACT_APP_NODE_ADDRESS);

const applyMyCandidate = async () => {
  try {
    const api = await ApiPromise.create({ provider });
    const allAccounts = await web3Accounts();
    const account = allAccounts[0];

    const response = await new Promise((resovle) => {
      setTimeout(async () => {
        if (account.address) {
          const signer = account.address;
          try {
            const txHash = await api.tx.cosmosAbci
              .add_condidate(signer)
              .signAndSend(signer);
            resovle(txHash.toString());
          } catch (err) {
            resovle(err);
          }
        }
        // Set 5s delay between txs.
      }, 5000);
    });

    // eslint-disable-next-line no-console
    console.log(response);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};

const buttons = {
  search: <Button><SearchIcon /></Button>,
  apply: <Button primary onClick={() => applyMyCandidate()}>Apply my candidate</Button>,
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
