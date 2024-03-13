import React from 'react';
import { useLocation } from 'react-router-dom';
import router from '../../../router';

import styles from './styles.module.scss';

function HomeHeader() {
  // TODO do we need this component at all ?
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
    [router.wallet.ethBridge]: 'Ethereum Bridge',
    [router.wallet.ethBridgeDeposit]: 'Ethereum Bridge',
    [router.wallet.ethBridgeWithdraw]: 'Ethereum Bridge',
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
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
}

export default HomeHeader;
