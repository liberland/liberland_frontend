import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { authActions } from '../../../redux/actions';
import router from '../../../router';

import styles from './styles.module.scss';

const HomeHeader = () => {
  const titles = {
    [router.home.profile]: 'My profile',
    [router.home.documents]: 'My documents',
    [router.home.feed]: 'Hi, {Username}!',
    [router.home.constitution]: 'Constitution',
    [router.home.voting]: 'Voting',
    [router.home.wallet]: 'Wallet',
  };
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(authActions.signOut.call(history));
  };

  return (
    <div className={styles.homeHeaderWrapper}>
      <div className={styles.homeHeaderAccountWrapper}>
        <p>{titles[location.pathname]}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default HomeHeader;
