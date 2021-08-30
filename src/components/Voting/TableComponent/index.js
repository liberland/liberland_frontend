/* eslint-disable react/prop-types */
import React from 'react';
import { web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';

import cx from 'classnames';

import Card from '../../Card';
import Button from '../../Button/Button';
import Table from '../../Table';

import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg';
import styles from './styles.module.scss';

const { ApiPromise, WsProvider } = require('@polkadot/api');

const applyMyCandidate = async () => {
  try {
    const provider = await new WsProvider(process.env.REACT_APP_NODE_ADDRESS);
    const api = await ApiPromise.create({ provider });

    const allAccounts = await web3Accounts();
    const accountAddress = allAccounts[0].address;
    // TODO: Move this method to sage
    // const candidatesList = await api.query.assemblyPallet.candidatesList();
    // console.log('candidatesList', candidatesList);

    if (accountAddress) {
      const injector = await web3FromAddress(accountAddress);
      await api.tx.assemblyPallet
        .addCondidate()
        .signAndSend(accountAddress, { signer: injector.signer }, ({ status }) => {
          if (status.isInBlock) {
            // eslint-disable-next-line no-console
            console.log(`Completed at block hash #${status.asInBlock.toString()}`);
          } else {
            // eslint-disable-next-line no-console
            console.log(`Current status: ${status.type}`);
          }
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.log(':( transaction failed', error);
        });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error', e);
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
