import React from 'react';

// assets
import styles from './styles.module.scss';
import Logo from '../../../assets/images/logo.png';

const Header = () => (
  <div className={styles.headerWrapper}>
    <div className={styles.logoContainer}>
      <img src={Logo} alt="logo" />
      <p>
        Free republic of
        <br />
        <span>Liberland</span>
      </p>
    </div>
    <div />
  </div>
);

export default Header;
