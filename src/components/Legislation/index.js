import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import LegislationHeader from './LegislationHeader';
import LegislationView from './LegislationView';
import router from '../../router';

import stylesPage from '../../utils/pagesBase.module.scss';

function Legislation() {
  return (
    <div className={stylesPage.sectionWrapper}>
      <div className={stylesPage.menuAdressWrapper}>
        <LegislationHeader />
      </div>

      <div>
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
      </div>
    </div>
  );
}

export default Legislation;
