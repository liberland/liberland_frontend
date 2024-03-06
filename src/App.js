// LIBS
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

// ROUTER
import routes from './router';

// COMPONENTS
import SignIn from './components/AuthComponents/SignIn';
import SignUp from './components/AuthComponents/SignUp';
import Home from './components/Home';
import Loader from './components/Loader';

// REDUX
import { userSelectors } from './redux/selectors';
import { authActions } from './redux/actions';
import GuidedSetup from './components/GuidedSetup';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(authActions.verifySession.call());
  }, [dispatch]);

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
  const appRouter = user ? loggedInRoutes : loggedOutRoutes;
  return (
    <Router>
      <Loader>
        <GuidedSetup>
          {appRouter}
        </GuidedSetup>
      </Loader>
    </Router>
  );
}

export default App;
