import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useSelector } from 'react-redux';
import router from '../../../router';

import styles from './styles.module.scss';
import Button from '../../Button/Button';
import { userSelectors } from '../../../redux/selectors';

function HomeHeader() {
  const { login } = useContext(AuthContext);
  const user = useSelector(userSelectors.selectUser);

  // TODO do we need this component at all ? It only works if the route is 'raw' aka doesnt have /overview etc
  const titles = {
    [router.home.profile]: 'My profile',
    [router.home.documents]: 'My documents',
    [router.documents.myAccount]: 'My documents',
    [router.documents.citizenshipHistory]: 'My documents',
    [router.documents.courtCases]: 'My documents',
    [router.documents.landOwnership]: 'My documents',
    [router.home.feed]: 'Your feed',
    [router.home.legislation]: 'Legislation',
    [router.home.offices]: 'Offices',
    [router.home.registries]: 'Registries',
    [router.home.staking]: 'Staking',
    [router.home.congress]: 'Congress',
    [router.home.voting]: 'Voting',
    [router.home.wallet]: 'Wallet',
  };
  const location = useLocation();
  // const fullName = name && lastName ? `${name} ${lastName}` : undefined;
  return titles[location.pathname] ? (
    <div className={styles.homeHeaderWrapper}>
      <div className={styles.homeHeaderAccountWrapper}>
        <div className={styles.titleWrapper}>
          <span className={styles.headerTitle}>
            {titles[location.pathname]}
          </span>
          {!user && (
          <Button primary small onClick={() => login()}>
            Sign In
          </Button>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
}

export default HomeHeader;
