import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.scss';
import './assets/main.scss';
import { AuthProvider } from 'react-oauth2-code-pkce';
import App from './App';
import store from './redux/store';
import { authActions, onBoardingActions } from './redux/actions';

const adminAuthConfig = {
  clientId: `${process.env.REACT_APP_SSO_API_ADMIN_CLIENT_ID}`,
  authorizationEndpoint: `${process.env.REACT_APP_SSO_API}/oauth/authorize`,
  tokenEndpoint: `${process.env.REACT_APP_SSO_API}/oauth/token`,
  redirectUri: `${process.env.REACT_APP_SSO_API_ADMIN_LINK}`,
  scope: 'others:read_write',
  postLogin: () => {
    store.dispatch(authActions.verifySession.call());
    store.dispatch(onBoardingActions.getEligibleForComplimentaryLld.call());
  },
  decodeToken: false,
};

const authConfig = {
  clientId: `${process.env.REACT_APP_SSO_API_CLIENT_ID}`,
  authorizationEndpoint: `${process.env.REACT_APP_SSO_API}/oauth/authorize`,
  tokenEndpoint: `${process.env.REACT_APP_SSO_API}/oauth/token`,
  redirectUri: process.env.REACT_APP_FRONTEND_REDIRECT,
  postLogin: () => {
    store.dispatch(authActions.verifySession.call());
    store.dispatch(onBoardingActions.getEligibleForComplimentaryLld.call());
  },
  decodeToken: false,
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
