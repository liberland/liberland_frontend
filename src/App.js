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
import SignUp from './components/AuthComponents/SignUp';
import Home from './components/Home';
import Loader from './components/Loader';

// REDUX
import { userSelectors } from './redux/selectors';
import { authActions } from './redux/actions';
import GuidedSetup from './components/GuidedSetup';
import { CheckExtensionWalletProvider } from './components/CheckExtenstionWalletProvider';
import SignIn from './components/AuthComponents/SigIn';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(authActions.verifySession.call());
  }, [dispatch]);

  const user = useSelector(userSelectors.selectUser);

  const appRouter = (
    <Switch>
      <Route path={routes.signUp} component={SignUp} />
      <Route path={routes.home.index} component={Home} />
      <Route key={routes.signIn} path={routes.signIn} component={SignIn} />
      <Route path="*" render={() => <Redirect to={routes.home.index} />} />
    </Switch>
  );

  return (
    <Router>
      <Loader>
        {user ? (
          <CheckExtensionWalletProvider>
            <GuidedSetup>{appRouter}</GuidedSetup>
          </CheckExtensionWalletProvider>
        ) : (
          <CheckExtensionWalletProvider>{appRouter}</CheckExtensionWalletProvider>
        )}
      </Loader>
    </Router>
  );
}

export default App;
