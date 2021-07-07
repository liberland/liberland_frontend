import React from 'react';
import styles from '../styles.module.scss';
import Button from '../../Button/Button';
import { ReactComponent as UserCandidacyWhite } from '../../../assets/icons/user-candidacy-white.svg';
import { ReactComponent as UserCongressional } from '../../../assets/icons/user-congressional.svg';

const CongressionalAssemblyElectionsHeader = () => (
  <>
    <div className={styles.congressionalWrapper}>
      <div className={styles.headCongressional}>
        <div className={styles.headCongressionalFirstItem}>
          <UserCongressional />
          <h3>
            XXXIV Congressional Assembly Elections
          </h3>
        </div>
      </div>
      <Button primary small className={styles.upcomingVotings}>
        <UserCandidacyWhite />
        {' '}
        Apply my candidacy
        {' '}
      </Button>
    </div>
    <span className={styles.headCongressionalSecondItem}>Election finishes 12th of July 2021</span>
  </>
);

export default CongressionalAssemblyElectionsHeader;
