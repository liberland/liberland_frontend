import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import LegislationView from './LegislationView';
import router from '../../router';

function Legislation() {
  return (
    <Switch>
      <Route
        exact
        path={router.legislation.view}
        component={LegislationView}
      />
      <Route
        exact
        path={router.home.legislation}
        render={() => (
          <Redirect to={`${router.home.legislation}/Constitution`} />
        )}
      />
    </Switch>
  );
}

export default Legislation;
