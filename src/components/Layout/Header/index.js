import React from 'react';
import { useSelector } from 'react-redux';
import { Header as HeaderInternal } from 'antd/es/layout/layout';
import Flex from 'antd/es/flex';
import { useMediaQuery } from 'usehooks-ts';
import styles from '../styles.module.scss';
import LiberlandLettermark from '../../../assets/icons/Liberland_Lettermark.svg';
import LiberlandLettermarkMobile from '../../../assets/icons/Liberland_Lettermark_Mobile.svg';
import ChangeWallet from '../../Home/ChangeWallet';
import UserMenu from '../../UserMenu';
import { userSelectors } from '../../../redux/selectors';
import UrlMenu from '../UrlMenu';

function Header() {
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 768px)');
  const roles = useSelector(userSelectors.selectUserRole);
  const isEResident = roles?.['e-resident'] === 'e-resident';

  return (
    <HeaderInternal className={styles.header}>
      {isBiggerThanSmallScreen ? (
        <>
          <img alt="logo" src={LiberlandLettermark} className={styles.logo} />
          <div className={styles.version}>
            Blockchain
            <br />
            Dashboard 2.0
          </div>
        </>
      ) : (
        <>
          <UrlMenu />
          <img alt="logo" src={LiberlandLettermarkMobile} className={styles.mobileLogo} />
          <div className={styles.mobileUser}>
            <UserMenu isEResident={isEResident} />
          </div>
        </>
      )}
      {isBiggerThanSmallScreen && (
        <div className={styles.user}>
          <Flex gap="20px" align="center" justify="center">
            <ChangeWallet />
            <UserMenu isEResident={isEResident} />
          </Flex>
        </div>
      )}
    </HeaderInternal>
  );
}

export default Header;
