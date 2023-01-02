import React from 'react';

// assets
import styles from './styles.module.scss';
import Logo from '../../../assets/images/logo.png';

function Header() {
  return (
    <div className={styles.logoContainer}>
      <img src={Logo} alt="logo" />
      <p>
        Free republic of
        <br />
        <span>Liberland</span>
      </p>
    </div>
  );
}

export default Header;
