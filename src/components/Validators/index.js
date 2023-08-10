import React from 'react';
import {
  Switch, Route,
} from 'react-router-dom';
import router from '../../router';

import HelloWorld from "./HelloWorld";
import ValidatorsHeader from "./ValidatorsHeader"

function Validators() {
  return (
    <div>
      <div>
        <ValidatorsHeader />
      </div>
      <div>
        <Switch>
          <Route
            exact
            path={router.validators.overview}
            component={HelloWorld}
          />
          <Route
            exact
            path={router.validators.hello}
            component={HelloWorld}
          />
          <Route
            exact
            path={router.validators.world}
            component={HelloWorld}
          />
        </Switch>
      </div>
    </div>
  )
}

export default Validators;
