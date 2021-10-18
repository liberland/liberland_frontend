import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import AssemblyHeader from './AssemblyHeader';
import MyDrafts from './MyDrafts';
import ConstitutionalChange from './ConstitutionalChange';
import Legislation from './LegislationVotes';
import Decision from './Decision';
import VoteHistory from './VoteHistory';
import PMElection from './PMElection';
import styles from './styles.module.scss';
import router from '../../router';
import RoleHOC from '../../hocs/RoleHOC';

const Assembly = () => (
  <div className={styles.assemblyWrapper}>
    <AssemblyHeader />
    <Switch>
      <Route
        exact
        path={router.assembly.myDrafts}
        component={MyDrafts}
      />
      <Route
        path={router.assembly.legislationVotes}
        component={Legislation}
      />
      <Route
        path={router.assembly.constitutionalChangeVotes}
        component={ConstitutionalChange}
      />
      <Route
        path={router.assembly.decisionVotes}
        component={Decision}
      />
      <Route
        path={router.assembly.voteHistory}
        component={VoteHistory}
      />
      <Route
        path={router.assembly.pmElection}
        component={PMElection}
      />
      <Route
        exact
        path={router.home.assembly}
        render={() => (
          <RoleHOC>
            <Redirect to={router.assembly.myDrafts} />
          </RoleHOC>
        )}
      />
    </Switch>
  </div>
);

export default Assembly;
