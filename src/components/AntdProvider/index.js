import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import theme from 'antd/es/theme';
import ConfigProvider from 'antd/es/config-provider';
import { useMediaQuery } from 'usehooks-ts';

const { defaultAlgorithm, darkAlgorithm } = theme;

const AntdProviderContext = createContext();

export const useAntdProviderContext = () => useContext(AntdProviderContext);

export default function AntdProvider({ children }) {
  const systemPrefersDark = useMediaQuery(
    {
      query: '(prefers-color-scheme: dark)',
    },
    undefined,
    (prefersDark) => {
      // eslint-disable-next-line no-use-before-define
      setDarkMode(prefersDark);
    },
  );
  const [isDarkMode, setDarkMode] = useState(systemPrefersDark);

  return (
    <ConfigProvider
      form={{
        validateMessages: {
          required: 'Enter a value',
        },
      }}
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
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
            itemActiveColor: '#243F5F',
            subMenuItemSelectedColor: '#243F5F',
            itemSelectedBg: '#EAEEF0',
            groupTitleColor: '#ACBDC5',
            subMenuItemBorderRadius: '0',
            horizontalItemHoverColor: '#F2F2F2',
            horizontalItemSelectedColor: 'transparent',
          },
          Button: {
            defaultActiveBorderColor: '#CCD6DB',
            defaultBg: 'white',
            defaultBorderColor: '#CCD6DB',
            defaultHoverBorderColor: '#CCD6DB',
            defaultHoverColor: '#243F5F',
            defaultHoverBg: '#EAEEF0',
            defaultShadow: '0',
            primaryColor: '#122C4B',
            primaryShadow: '0',
            colorPrimaryBorder: '#F6CA31',
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
            contentPadding: '20px',
            headerBg: 'white',
            headerPadding: '20px',
            colorBorder: '#F2F2F2',
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
          Table: {
            headerBg: '#ffffff',
            borderColor: '#F2F2F2',
            headerColor: '#ACBDC5',
          },
        },
      }}
    >
      <AntdProviderContext.Provider value={setDarkMode}>
        {children}
      </AntdProviderContext.Provider>
    </ConfigProvider>
  );
}

AntdProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
