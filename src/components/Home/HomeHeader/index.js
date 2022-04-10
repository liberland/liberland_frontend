import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import { useHistory, useLocation } from 'react-router-dom';
import useDropdown from '../../../hooks/useDropdown';
import { authActions } from '../../../redux/actions';
import { userSelectors } from '../../../redux/selectors';
import router from '../../../router';

import AssemblyInfoHomeHeader from '../../Assembly/AssemblyInfoHomeHeader';

import styles from './styles.module.scss';

const HomeHeader = () => {
  const name = useSelector(userSelectors.selectUserName);
  const lastName = useSelector(userSelectors.selectUserLastName);
  const titles = {
    [router.home.profile]: 'My profile',
    [router.home.documents]: 'My documents',
    [router.documents.myAccount]: 'My documents',
    [router.documents.citizenshipHistory]: 'My documents',
    [router.documents.courtCases]: 'My documents',
    [router.documents.landOwnership]: 'My documents',
    [router.home.feed]: `Hi, ${name} ${lastName}!`,
    [router.home.constitution]: 'Law',
    [router.home.voting]: 'Voting',
    [router.voting.voteHistory]: 'Voting',
    [router.voting.congressionalAssemble]: 'Voting',
    [router.voting.vetoVotes]: 'Voting',
    [router.home.wallet]: 'Wallet',
    [router.home.assembly]: 'Assembly',
    [router.assembly.myDrafts]: 'Assembly',
    [router.assembly.legislationVotes]: 'Assembly',
    [router.assembly.decisionVotes]: 'Assembly',
    [router.assembly.voteHistory]: 'Assembly',
    [router.assembly.pmElection]: 'Assembly',
    [router.wallet.validatorsStaking]: 'Validator Staking',
  };
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [
    isOpen, toggleDropdown, dropdown, trigger,
  ] = useDropdown();

  const handleLogout = () => {
    dispatch(authActions.signOut.call(history));
  };

  const isAssembly = () => ((location.pathname.indexOf(router.home.assembly.split('/').pop())) !== -1);

  return (
    <div className={styles.homeHeaderWrapper}>
      <div className={styles.homeHeaderAccountWrapper}>
        <div className={styles.titleWrapper}>
          <span className={styles.headerTitle}>{titles[location.pathname]}</span>
          { isAssembly() && <AssemblyInfoHomeHeader /> }
        </div>
        <div className={styles.avatarWrapper}>
          <div ref={trigger} className={styles.avatar}>
            <Avatar name={`${name} ${lastName}`} round onClick={toggleDropdown} size="47px" fgColor="#F1C823" color="#FDF4E0" />
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
};

export default HomeHeader;
