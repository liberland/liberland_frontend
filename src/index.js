import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.scss';
import './assets/main.scss';
import { AuthProvider } from 'react-oauth2-code-pkce';
import App from './App';
import store from './redux/store';
import { authActions, blockchainActions, onBoardingActions } from './redux/actions';
import AntdProvider from './components/AntdProvider';

const defaultConfig = {
  tokenEndpoint: `${process.env.REACT_APP_SSO_API}/oauth/token`,
  authorizationEndpoint: `${process.env.REACT_APP_SSO_API}/oauth/authorize`,
  decodeToken: false,
  autoLogin: false,
  postLogin: () => {
    store.dispatch(authActions.verifySession.call());
    store.dispatch(onBoardingActions.getEligibleForComplimentaryLld.call());
  },
  onRefreshTokenExpire: (event) => {
    const storeData = store.getState();
    event.login();
    localStorage.removeItem('BlockchainAdress');

    const walletAddress = storeData.user.user.blockchainAddress;
    store.dispatch(blockchainActions.setUserWallet.success(walletAddress));
  },
};

const adminAuthConfig = {
  clientId: `${process.env.REACT_APP_SSO_API_ADMIN_CLIENT_ID}`,
  redirectUri: `${process.env.REACT_APP_SSO_API_ADMIN_LINK}`,
  scope: 'others:read_write',
  ...defaultConfig,
};

const authConfig = {
  clientId: `${process.env.REACT_APP_SSO_API_CLIENT_ID}`,
  redirectUri: process.env.REACT_APP_FRONTEND_REDIRECT,
  ...defaultConfig,
};

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const isAdminLogin = urlParams.get('admin');
if (isAdminLogin === 'true') { localStorage.setItem('isAdminLogin', 'true'); }
const useAuthConfig = localStorage.getItem('isAdminLogin') === 'true' ? adminAuthConfig : authConfig;

ReactDOM.createRoot(
  document.getElementById('root'),
).render(
  <Provider store={store}>
    <AuthProvider authConfig={useAuthConfig}>
      <AntdProvider>
        <App />
      </AntdProvider>
    </AuthProvider>
  </Provider>,
);
