import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import router from '../../router';
import { loaderFactory } from '../../utils/loader';

const loader = loaderFactory(__dirname);

function Legislation() {
  return (
    <Switch>
      <Route
        exact
        path={router.legislation.view}
        component={loader('./LegislationView')}
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
