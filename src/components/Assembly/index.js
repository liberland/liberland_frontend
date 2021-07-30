import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import AssemblyHeader from './AssemblyHeader';

import styles from './styles.module.scss';
import router from '../../router';
import RoleHOC from '../../hocs/RoleHOC';

const Assembly = () => (
  <div className={styles.assemblyWrapper}>
    <AssemblyHeader />
    <div>
      <Switch>
        <Route
          exact
          path={router.assembly.myDrafts}
          component={() => <div>My drafts</div>}
        />
        <Route
          path={router.assembly.legislationVotes}
          component={() => <div>Legislation votes</div>}
        />
        <Route
          path={router.assembly.decisionVotes}
          component={() => <div>Decision votes</div>}
        />
        <Route
          path={router.assembly.voteHistory}
          component={() => <div>Vote history</div>}
        />
        <Route
          path={router.assembly.pmElection}
          component={() => <div>PM Election</div>}
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
  </div>
);

export default Assembly;
