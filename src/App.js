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
import Loader from './components/Loader';

// REDUX
import { userSelectors } from './redux/selectors';
import { authActions } from './redux/actions';
import GuidedSetup from './components/GuidedSetup';
import { CheckExtensionWalletProvider } from './components/CheckExtenstionWalletProvider';
import { loaderFactory } from './utils/loader';

const loader = loaderFactory(__dirname);

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(authActions.verifySession.call());
  }, [dispatch]);

  const user = useSelector(userSelectors.selectUser);

  const appRouter = (
    <Switch>
      <Route path={routes.signUp} component={loader('./components/AuthComponents/SignUp')} />
      <Route path={routes.home.index} component={loader('./components/Home')} />
      <Route key={routes.signIn} path={routes.signIn} component={loader('./components/AuthComponents/SignIn')} />
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
