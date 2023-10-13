import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.scss';
import './assets/main.scss';
import { DAppProvider } from '@usedapp/core';
import App from './App';
import store from './redux/store';

const etherConfig = {
  readOnlyChainId: process.env.REACT_APP_ETHER_CHAIN_ID,
  readOnlyUrls: {
    [process.env.REACT_APP_ETHER_CHAIN_ID]: process.env.REACT_APP_ETHER_PROVIDER,
  },
};

ReactDOM.render(
  <DAppProvider config={etherConfig}>
    <Provider store={store}>
      <App />
    </Provider>
  </DAppProvider>,
  document.getElementById('root'),
);
