import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import { useHistory, useLocation } from 'react-router-dom';
import useDropdown from '../../../hooks/useDropdown';
import { authActions } from '../../../redux/actions';
import { userSelectors } from '../../../redux/selectors';
import router from '../../../router';

import styles from './styles.module.scss';

function HomeHeader() {
  const name = useSelector(userSelectors.selectUserGivenName);
  const lastName = useSelector(userSelectors.selectUserFamilyName);
  const hiMsg = name && lastName ? `Hi, ${name} ${lastName}!` : "Hi!";
  const titles = {
    [router.home.profile]: 'My profile',
    [router.home.documents]: 'My documents',
    [router.documents.myAccount]: 'My documents',
    [router.documents.citizenshipHistory]: 'My documents',
    [router.documents.courtCases]: 'My documents',
    [router.documents.landOwnership]: 'My documents',
    [router.home.feed]: hiMsg,
    [router.home.legislation]: 'Legislation',
    [router.home.offices]: 'Offices',
    [router.home.registries]: 'Registries',
    [router.home.validators]: 'Validators',
    [router.home.congress]: 'Congress',
    [router.home.voting]: 'Voting',
    [router.voting.congressionalAssemble]: 'Voting',
    [router.voting.referendum]: 'Voting',
    [router.home.wallet]: 'Wallet',
    [router.wallet.validatorsStaking]: 'Validator Staking',
    [router.wallet.ethBridge]: 'Ethereum Bridge',
    [router.wallet.ethBridgeDeposit]: 'Ethereum Bridge',
    [router.wallet.ethBridgeWithdraw]: 'Ethereum Bridge',
  };
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [
    isOpen, toggleDropdown, dropdown, trigger,
  ] = useDropdown();

  const handleLogout = () => {
    dispatch(authActions.signOut.call(history));
    window.location.replace(process.env.REACT_APP_SSO_API_LOGOUT_IMPLICIT_LINK);
  };

  const fullName = name && lastName ? `${name} ${lastName}` : undefined;
  return (
    <div className={styles.homeHeaderWrapper}>
      <div className={styles.homeHeaderAccountWrapper}>
        <div className={styles.titleWrapper}>
          <span className={styles.headerTitle}>{titles[location.pathname]}</span>
        </div>
        <div className={styles.avatarWrapper}>
          <div ref={trigger} className={styles.avatar}>
            <Avatar name={fullName} round onClick={toggleDropdown} size="47px" fgColor="#F1C823" color="#FDF4E0" />
          </div>
          {isOpen && (
            <div className={styles.dropdown} ref={dropdown}>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeHeader;
