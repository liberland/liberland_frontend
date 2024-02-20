import React from 'react';

// assets
import styles from './styles.module.scss';
import LiberlandLettermark from '../../../assets/icons/Liberland_Lettermark.svg';

function Header() {
  return (
    <div className={styles.logoContainer}>
      <img className={styles.logo} src={LiberlandLettermark} alt="logo" />
    </div>
  );
}

export default Header;
