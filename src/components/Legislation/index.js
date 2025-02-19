import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import router from '../../router';
import { loader } from '../../utils/loader';

function Legislation() {
  return (
    <Switch>
      <Route
        exact
        path={router.legislation.view}
        component={loader(() => import('./LegislationView'))}
      />
      <Route
        exact
        path={router.home.legislation}
        render={() => (
          <Redirect to={router.legislation.decisions} />
        )}
      />
    </Switch>
  );
}

export default Legislation;
