import React, { useContext } from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import { NavLink, useLocation } from 'react-router-dom/cjs/react-router-dom.min';

import { useSelector } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';
import RoleHOC from '../../hocs/RoleHOC';
import router from '../../router';

import styles from './styles.module.scss';
import stylesPage from '../../utils/pagesBase.module.scss';
import Button from '../Button/Button';
import { userSelectors } from '../../redux/selectors';
import { MotionProvider } from '../WalletCongresSenate/ContextMotions';
import { loader } from '../../utils/loader';

function ReferendumWrapper() {
  const Referendum = loader(() => import('./Referendum'));
  return (
    <MotionProvider>
      <Referendum />
    </MotionProvider>
  );
}

function Voting() {
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const user = useSelector(userSelectors.selectUser);
  return (
    <div className={stylesPage.sectionWrapper}>
      <div className={stylesPage.menuAddressWrapper}>
        <div className={styles.votingHeaderWrapper}>
          {location.pathname === router.voting.referendum && (
          <NavLink
            className={styles.linkButton}
            to={user ? router.voting.addLegislation : ''}
          >
            <Button
              onClick={() => !user && login()}
              primary
            >
              {user ? 'Propose' : 'Log in to propose referenda'}
            </Button>
          </NavLink>
          )}

        </div>
      </div>

      <div>
        <Switch>
          <Route
            exact
            path={router.voting.congressionalAssemble}
            component={loader(() => import('./CongressionalAssemble'))}
          />
          <Route
            path={router.voting.referendum}
            component={ReferendumWrapper}
          />
          <Route
            path={router.voting.addLegislation}
            component={loader(() => import('./Referendum/ProposalForms/AddLegislation/AddLegislation'))}
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
