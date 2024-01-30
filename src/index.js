import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.scss';
import './assets/main.scss';
import { DAppProvider } from '@usedapp/core';
import { AuthProvider } from 'react-oauth2-code-pkce';
import App from './App';
import store from './redux/store';
import { authActions } from './redux/actions';

const etherConfig = {
  readOnlyChainId: process.env.REACT_APP_ETHER_CHAIN_ID,
  readOnlyUrls: {
    [process.env.REACT_APP_ETHER_CHAIN_ID]: process.env.REACT_APP_ETHER_PROVIDER,
  },
};

const authConfig = {
  clientId: '5',
  authorizationEndpoint: `${process.env.REACT_APP_SSO_API}/oauth/authorize`,
  tokenEndpoint: `${process.env.REACT_APP_SSO_API}/oauth/token`,
  redirectUri: process.env.REACT_APP_FRONTEND_REDIRECT,
  postLogin: () => store.dispatch(authActions.verifySession.call()),
  decodeToken: false,
};

ReactDOM.render(
  <DAppProvider config={etherConfig}>
    <Provider store={store}>
      <AuthProvider authConfig={authConfig}>
        <App />
      </AuthProvider>
    </Provider>
  </DAppProvider>,
  document.getElementById('root'),
);
