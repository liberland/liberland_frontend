import React from 'react';
import { useLocation } from 'react-router-dom';

import route from '../../router';
import VotingHeader from './VotingHeader';
import TabsVoting from './TabsVoting';
import CongressionalAssemblyElectionsHeader from './CongressionalAssemblyElectionsHeader';

import styles from './styles.module.scss';
import CongressionalAssemble from './CongressionalAssemble';

const Voting = () => {
  const location = useLocation();
  return (
    <div className={styles.votingWrapper}>
      {(location.pathname === route.voting.congressional)
        ? (
          <>
            <CongressionalAssemblyElectionsHeader />
            <CongressionalAssemble title=" All candidates" />
          </>
        )
        : (
          <>
            <VotingHeader />
            <TabsVoting />
          </>
        )}
    </div>
  );
};

export default Voting;
