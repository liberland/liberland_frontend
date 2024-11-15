import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import RoleHOC from '../../hocs/RoleHOC';
import router from '../../router';
import Profile from '../Profile';

import styles from './styles.module.scss';

function Documents() {
  return (
    <Switch>
      <Route
        path={router.documents.myAccount}
        // eslint-disable-next-line react/no-unstable-nested-components
        component={() => <Profile className={styles.withoutMargin} />}
      />
      <Route
        path={router.documents.citizenshipHistory}
        // eslint-disable-next-line react/no-unstable-nested-components
        component={() => <div>Citizenship History</div>}
      />
      <Route
        path={router.documents.courtCases}
        // eslint-disable-next-line react/no-unstable-nested-components
        component={() => <div>Court cases</div>}
      />
      <Route
        path={router.documents.landOwnership}
        // eslint-disable-next-line react/no-unstable-nested-components
        component={() => <div>Land ownership</div>}
      />
      <Route
        exact
        path={router.home.documents}
        render={() => (
          <RoleHOC>
            <Redirect to={router.documents.myAccount} />
          </RoleHOC>
        )}
      />
    </Switch>
  );
}

export default Documents;
