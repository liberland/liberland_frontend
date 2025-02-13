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
import { loader } from './utils/loader';
import { ModalProvider } from './context/modalContext';
import useLogin from './hooks/useLogin';

function App() {
  const dispatch = useDispatch();
  const login = useLogin(true);

  useEffect(() => {
    dispatch(authActions.verifySession.call());
  }, [dispatch]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.get('mobileLogin');
    if (urlParams.get('mobileLogin') === 'true') {
      urlParams.delete('mobileLogin');
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
      login();
    }
  }, [login]);

  const user = useSelector(userSelectors.selectUser);

  const appRouter = (
    <Switch>
      <Route path={routes.signUp} component={loader(() => import('./components/AuthComponents/SignUp'))} />
      <Route path={routes.callback} component={loader(() => import('./components/AuthComponents/Callback'))} />
      <Route path={routes.home.index} component={loader(() => import('./components/Home'))} />
      <Route
        key={routes.signIn}
        path={routes.signIn}
        component={loader(() => import('./components/AuthComponents/SignIn'))}
      />
      <Route path="*" render={() => <Redirect to={routes.home.index} />} />
    </Switch>
  );

  return (
    <Router>
      <ModalProvider>
        <Loader>
          {user ? (
            <CheckExtensionWalletProvider>
              <GuidedSetup>{appRouter}</GuidedSetup>
            </CheckExtensionWalletProvider>
          ) : (
            <CheckExtensionWalletProvider>{appRouter}</CheckExtensionWalletProvider>
          )}
        </Loader>
      </ModalProvider>
    </Router>
  );
}

export default App;
