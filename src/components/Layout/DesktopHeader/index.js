import React from 'react';
import { Header as HeaderInternal } from 'antd/es/layout/layout';
import Flex from 'antd/es/flex';
import styles from '../styles.module.scss';
import { ReactComponent as LiberlandLettermark } from '../../../assets/icons/Liberland_Lettermark.svg';
import ChangeWallet from '../../Home/ChangeWallet';
import UserMenu from '../../UserMenu';

function DesktopHeader() {
  return (
    <HeaderInternal
      className={styles.header}
    >
      <LiberlandLettermark alt="logo" className={styles.logo} />
      <div className={styles.version}>
        Blockchain
        <br />
        Dashboard 2.0
      </div>
      <div className={styles.user}>
        <Flex gap="20px" align="center" justify="center">
          <ChangeWallet />
          <UserMenu />
        </Flex>
      </div>
    </HeaderInternal>
  );
}

export default DesktopHeader;
