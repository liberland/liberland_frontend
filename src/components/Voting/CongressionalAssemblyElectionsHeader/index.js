import React from 'react';

import Button from '../../Button/Button';
import { ReactComponent as UserCandidacyWhite } from '../../../assets/icons/user-candidacy-white.svg';
import { ReactComponent as UserCongressional } from '../../../assets/icons/user-congressional.svg';

import styles from './styles.module.scss';

// eslint-disable-next-line react/prop-types
const CongressionalAssemblyElectionsHeader = ({ handlerOnClickApplyMyCandidacy }) => (
  <>
    <div className={styles.headCongressional}>
      <div className={styles.headCongressionalFirstItem}>
        <UserCongressional />
        <h3>
          XXXIV Congressional Assembly Elections
        </h3>
      </div>
      <span className={styles.headCongressionalSecondItem}>
        Election finishes 12th of July 2021
      </span>
    </div>
    <Button primary className={styles.upcomingVotings} onClick={handlerOnClickApplyMyCandidacy}>
      <UserCandidacyWhite />
      {' '}
      Apply my candidacy
    </Button>
  </>
);

export default CongressionalAssemblyElectionsHeader;
