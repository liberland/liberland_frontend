import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import { NavLink, useLocation } from 'react-router-dom/cjs/react-router-dom.min';

import VotingHeader from './VotingHeader';
import RoleHOC from '../../hocs/RoleHOC';
import router from '../../router';

import CongressionalAssemble from './CongressionalAssemble';
import styles from './styles.module.scss';
import stylesPage from '../../utils/pagesBase.module.scss';
import Referendum from './Referendum';
import { AddLegislation } from './Referendum/ProposalForms/AddLegislation/AddLegislation';
import Button from '../Button/Button';

function Voting() {
  const location = useLocation();

  return (
    <div className={stylesPage.sectionWrapper}>
      <div className={stylesPage.menuAddressWrapper}>
        <div className={styles.votingHeaderWrapper}>
          <VotingHeader />
          {location.pathname === router.voting.referendum && (
          <NavLink
            className={styles.linkButton}
            to={router.voting.addLegislation}
          >
            <Button small primary>Propose</Button>
          </NavLink>
          )}

        </div>
      </div>

      <div>
        <Switch>
          <Route
            exact
            path={router.voting.congressionalAssemble}
            component={CongressionalAssemble}
          />
          <Route
            path={router.voting.referendum}
            component={Referendum}
          />
          <Route
            path={router.voting.addLegislation}
            component={AddLegislation}
          />
          <Route
            exact
            path={router.home.voting}
            render={() => (
              <RoleHOC>
                <Redirect to={router.voting.congressionalAssemble} />
              </RoleHOC>
            )}
          />
        </Switch>
      </div>
    </div>
  );
}

export default Voting;
