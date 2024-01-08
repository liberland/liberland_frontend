import React from 'react';

// assets
import styles from './styles.module.scss';
import Logo from '../../../assets/images/logo.png';

function Header() {
  return (
    <div className={styles.logoContainer}>
      <img className={styles.logo} src={Logo} alt="logo" />
      <p>
        Free Republic of
        <br />
        <span>LIBERLAND</span>
      </p>
    </div>
  );
}

export default Header;
