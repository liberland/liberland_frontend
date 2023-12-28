// LIBS
import React, { useEffect, useState } from 'react';
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
import ModalRoot from './components/Modals/ModalRoot';
import DefaultModal from './components/Modals/DefaultModal';

// REDUX
import { userSelectors } from './redux/selectors';
import {
  authActions,
  blockchainActions,
} from './redux/actions';

const override = css`
  display: block;
  margin: 0 auto;
`;

function App() {
  const dispatch = useDispatch();
  const isSessionVerified = useSelector(userSelectors.selectIsSessionVerified);
  const user = useSelector(userSelectors.selectUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(authActions.verifySession.call());
    dispatch(blockchainActions.getAllWallets.call());
  }, [dispatch]);

  const loggedOutRoutes = (
    <Router>
      <Switch>
        <Route path={routes.signIn} component={SignIn} />
        <Route path={routes.signUp} component={SignUp} />
        <Route path="*" render={() => <Redirect to={routes.signIn} />} />
      </Switch>
    </Router>
  );

  const loggedInRoutes = (
    <Router>
      <Switch>
        <Route path={routes.home.index} component={Home} />
        <Route path="*" render={() => <Redirect to={routes.home.index} />} />
      </Switch>
    </Router>
  );

  const appRouter = user ? loggedInRoutes : loggedOutRoutes;

  useEffect(() => {
    const checkBrowser = async () => {
      const isBraveBrowserSaved = sessionStorage.getItem('braveBrowser');
      if (isBraveBrowserSaved === 'true') return;

      const isBrave = ((navigator.brave && await navigator.brave.isBrave()) || false);
      const isChrome = navigator.userAgent.includes('Chrome');
      const isFirefox = navigator.userAgent.includes('Firefox');

      if (isBrave || !(isChrome || isFirefox)) {
        setIsModalOpen(true);
        sessionStorage.setItem('braveBrowser', 'true');
      }
    };
    checkBrowser();
  }, []);

  return (
    <>
      {isModalOpen
          && (
          <ModalRoot>
            <DefaultModal onClickButton={() => setIsModalOpen(false)} text="We are not support brave browser">
              <span>If you want all functions to work properly, change your browser</span>
            </DefaultModal>
          </ModalRoot>
          )}
      {isSessionVerified ? (
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
      )}
    </>
  );
}

export default App;
