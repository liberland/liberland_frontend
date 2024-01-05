// LIBS
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import MoonLoader from 'react-spinners/MoonLoader';
import { css } from '@emotion/core';

// ROUTER
import routes from './router';

// COMPONENTS
import SignIn from './components/AuthComponents/SignIn';
import SignUp from './components/AuthComponents/SingUp';
import Home from './components/Home';
import Loader from './components/Loader';

// REDUX
import { userSelectors } from './redux/selectors';
import {
  authActions,
  blockchainActions,
  validatorActions,
} from './redux/actions';
import GuidedSetup from "./components/GuidedSetup";

const override = css`
  display: block;
  margin: 0 auto;
`;

function App() {
  const dispatch = useDispatch();
  const isSessionVerified = useSelector(userSelectors.selectIsSessionVerified);
  const user = useSelector(userSelectors.selectUser);

  useEffect(() => {
    dispatch(authActions.verifySession.call());
    dispatch(blockchainActions.getAllWallets.call());
  }, [dispatch]);

  const loggedOutRoutes = (
    <Router>
      <Switch>
        <Route path={routes.signIn} component={SignIn} />
        <Route path={routes.signUp} component={SignUp} />
        <Route path={routes.guidedSetup} component={GuidedSetup} />
        <Route path="*" render={() => <Redirect to={routes.signIn} />} />
      </Switch>
    </Router>
  );

  const loggedInRoutes = (
    <Router>
      <Switch>
        <Route path={routes.home.index} component={Home} />
        <Route path={routes.guidedSetup} component={GuidedSetup} />
        <Route path="*" render={() => <Redirect to={routes.home.index} />} />
      </Switch>
    </Router>
  );

  const appRouter = user ? loggedInRoutes : loggedOutRoutes;

  return isSessionVerified ? (
    <Loader>
      {appRouter}
    </Loader>
  ) : (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        background: 'rgb(170,170,170,0.1)',
      }}
    >
      <MoonLoader loading css={override} size={150} color="#F1C823" />
    </div>
  );
}

export default App;
