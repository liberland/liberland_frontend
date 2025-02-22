import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import router from '../../router';
import { loader } from '../../utils/loader';

function Documents() {
  return (
    <Switch>
      <Route
        path={router.documents.myAccount}
        component={loader(() => import('../Profile'))}
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
          <Redirect to={router.documents.myAccount} />
        )}
      />
    </Switch>
  );
}

export default Documents;
