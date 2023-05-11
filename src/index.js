import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.scss';
import './assets/main.scss';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App';
import store from './redux/store';
import { Hardhat, Goerli, Mainnet, DAppProvider } from '@usedapp/core';
import { getDefaultProvider } from 'ethers';

const etherConfig = {
  readOnlyChainId: process.env.REACT_APP_ETHER_CHAIN_ID,
  readOnlyUrls: {
    //[Mainnet.chainId]: getDefaultProvider('mainnet'),
    //[Goerli.chainId]: getDefaultProvider('goerli'),
    [process.env.REACT_APP_ETHER_CHAIN_ID]: process.env.REACT_APP_ETHER_PROVIDER,
  },
}


const client = new ApolloClient({
  uri: process.env.REACT_APP_EXPLORER,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <DAppProvider config={etherConfig}>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>
  </DAppProvider>,
  document.getElementById('root'),
);
