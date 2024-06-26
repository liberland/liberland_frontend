import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.scss';
import './assets/main.scss';
import { AuthProvider } from 'react-oauth2-code-pkce';
import App from './App';
import store from './redux/store';
import { authActions, blockchainActions, onBoardingActions } from './redux/actions';

const defaultConfig = {
  tokenEndpoint: `${process.env.REACT_APP_SSO_API}/oauth/token`,
  authorizationEndpoint: `${process.env.REACT_APP_SSO_API}/oauth/authorize`,
  decodeToken: false,
  postLogin: () => {
    store.dispatch(authActions.verifySession.call());
    store.dispatch(onBoardingActions.getEligibleForComplimentaryLld.call());
  },
  onRefreshTokenExpire: (event) => {
    event.login();
    localStorage.removeItem('BlockchainAdress');
    const storeData = store.getState();
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

ReactDOM.render(
  <Provider store={store}>
    <AuthProvider authConfig={useAuthConfig}>
      <App />
    </AuthProvider>
  </Provider>,
  document.getElementById('root'),
);
