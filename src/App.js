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
import { authActions } from './redux/actions';
import GuidedSetup from './components/GuidedSetup';

const override = css`
  display: block;
  margin: 0 auto;
`;

function App() {
  const isSessionVerified = useSelector(userSelectors.selectIsSessionVerified);
  const user = useSelector(userSelectors.selectUser);
  const loggedOutRoutes = (
    <Switch>
      <Route path={routes.signIn} component={SignIn} />
      <Route path={routes.signUp} component={SignUp} />
      <Route path="*" render={() => <Redirect to={routes.signIn} />} />
    </Switch>
  );

  const loggedInRoutes = (
    <Switch>
      <Route path={routes.home.index} component={Home} />
      <Route path="*" render={() => <Redirect to={routes.home.index} />} />
    </Switch>
  );

  const guidedStep = useSelector(userSelectors.selectGuidedStep);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.guidedStep.call());
    dispatch(authActions.verifySession.call());
  }, [dispatch]);

  const appRouter = user ? loggedInRoutes : loggedOutRoutes;
  return (
    <Router>
      {guidedStep?.status === 'loaded'
        ? (
          <Loader>
            {
              guidedStep?.component ? <GuidedSetup /> : appRouter
            }

          </Loader>
        )
        : !isSessionVerified && (
        <div
          style={{
            position: 'fixed',
            display: 'flex',
            height: '100vh',
            width: '100vw',
            top: 0,
            left: 0,
            alignItems: 'center',
            background: 'rgb(170,170,170,0.1)',
            zIndex: 1000,
          }}
        >
          <MoonLoader loading css={override} size={150} color="#F1C823" />
        </div>
        )}

    </Router>
  );
}

export default App;
