import React from 'react';
import {
  Switch, Route,
} from 'react-router-dom';
import router from '../../router';

import HelloWorld from './Overview';
import ValidatorsHeader from './ValidatorsHeader';
import styles from './styles.module.scss';

function Validators() {
  return (
    <div className={styles.validatorsWrapper}>
      <div className={styles.navWrapper}>
        <ValidatorsHeader />
      </div>
      <div>
        <Switch>
          <Route
            exact
            path={router.validators.overview}
            component={HelloWorld}
          />
        </Switch>
      </div>
    </div>
  );
}

export default Validators;
