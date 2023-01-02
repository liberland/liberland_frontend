import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import RoleHOC from '../../hocs/RoleHOC';
import router from '../../router';
import Profile from '../Profile';
import Tabs from '../Tabs';

import styles from './styles.module.scss';

const navigationList = [
  {
    route: router.documents.myAccount,
    title: 'My account',
  },
  {
    route: router.documents.citizenshipHistory,
    title: 'Citizenship history',

  },
  {
    route: router.documents.courtCases,
    title: 'Court cases',
  },
  {
    route: router.documents.landOwnership,
    title: 'Land ownership',
  },
];

function Documents() {
  return (
    <div className={styles.documentsWrapper}>
      <Tabs navigationList={navigationList} />

      <div>
        <Switch>
          <Route
            path={router.documents.myAccount}
            component={() => <Profile className={styles.withoutMargin} />}
          />
          <Route
            path={router.documents.citizenshipHistory}
            component={() => <div>Citizenship History</div>}
          />
          <Route
            path={router.documents.courtCases}
            component={() => <div>Court cases</div>}
          />
          <Route
            path={router.documents.landOwnership}
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
      </div>
    </div>
  );
}

export default Documents;
