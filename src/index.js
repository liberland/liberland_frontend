import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.scss';
import './assets/main.scss';
import { AuthProvider } from 'react-oauth2-code-pkce';
import ConfigProvider from 'antd/es/config-provider';
import App from './App';
import store from './redux/store';
import { authActions, blockchainActions, onBoardingActions } from './redux/actions';

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
      <ConfigProvider
        form={{
          validateMessages: {
            required: 'Enter a value',
          },
        }}
        theme={{
          token: {
            colorText: '#243F5F',
            fontSize: 18,
            fontSizeHeading5: 25,
            fontSizeHeading4: 29,
            fontSizeHeading3: 33,
            fontSizeHeading2: 37,
            fontSizeHeading1: 41,
            fontFamily: 'Open Sans',
          },
          components: {
            Layout: {
              bodyBg: 'white',
              footerBg: 'white',
              headerBg: 'white',
              headerColor: '#243F5F',
              headerHeight: '47px',
              headerPadding: '12.73px 10',
              lightTriggerColor: '#243F5F',
              siderBg: 'white',
              triggerBg: 'white',
              triggerColor: '#243F5F',
            },
            Menu: {
              subMenuItemBg: 'white',
              itemPaddingInline: '20px',
              itemMarginInline: '0',
              itemSelectedColor: '#243F5F',
              itemColor: '#243F5F',
              itemBorderRadius: '0',
              itemActiveBg: '#F2F2F2',
              groupTitleColor: '#ACBDC5',
              subMenuItemBorderRadius: '0',
              horizontalItemHoverColor: '#F2F2F2',
              horizontalItemSelectedColor: 'transparent',
            },
            Button: {
              defaultActiveBorderColor: '#243F5F',
              defaultBg: 'white',
              defaultBorderColor: '#ACBDC5',
              defaultHoverBorderColor: '#243F5F',
              defaultHoverColor: '#243F5F',
              defaultShadow: '0',
              primaryColor: '#243F5F',
              primaryShadow: '0',
              paddingBlock: '18px',
              paddingInline: '12px',
            },
            Typography: {
              colorText: '#243F5F',
              titleMarginBottom: '20px',
            },
            Tabs: {
              inkBarColor: '#243F5F',
              itemActiveColor: '#243F5F',
              itemColor: '#ACBDC5',
              itemHoverColor: '#243F5F',
            },
            Collapse: {
              contentPadding: '16px 0',
              headerBg: 'white',
              headerPadding: '8px 0',
              colorBorder: 'white',
              fontSize: 20,
              colorText: '#243F5F',
            },
            Card: {
              extraColor: '#243F5F',
              actionsLiMargin: '12px 5px',
            },
            InputNumber: {
              controlWidth: '100%',
              activeBorderColor: '#243F5F',
              hoverBorderColor: '#243F5F',
              colorText: '#243F5F',
            },
            Input: {
              activeBorderColor: '#243F5F',
              hoverBorderColor: '#243F5F',
              colorText: '#243F5F',
            },
            Message: {
              margin: 'auto 0',
            },
            Progress: {
              defaultColor: '#243F5F',
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </AuthProvider>
  </Provider>,
);
