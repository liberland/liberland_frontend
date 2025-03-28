import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import theme from 'antd/es/theme';
import ConfigProvider from 'antd/es/config-provider';
import { useMediaQuery } from 'usehooks-ts';

const { defaultAlgorithm, darkAlgorithm } = theme;

const ModeContext = createContext();

export const useModeContext = () => useContext(ModeContext);

export default function AntdProvider({ children }) {
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 992px)');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);
  const context = useMemo(() => ({ isDarkMode, setIsDarkMode }), [isDarkMode]);

  useLayoutEffect(() => {
    document.getElementsByTagName('html')[0].setAttribute('dark-mode', isDarkMode ? 'yes' : 'no');
  }, [isDarkMode]);

  const colorText = isDarkMode ? 'white' : '#243F5F';
  const itemSelected = isDarkMode ? '#2E3743' : '#EAEEF0';
  const activeBackground = isDarkMode ? '#1E202A' : 'white';
  const mildShadow = isDarkMode ? '#37383F' : '#F2F2F2';
  const shadow = isDarkMode ? '#7095A7' : '#EAEEF0';
  const mildBlue = isDarkMode ? '#7095A7' : '#ACBDC5';
  const activeBorder = isDarkMode ? '#37383F' : '#CCD6DB';
  const primaryColor = isDarkMode ? '#7095A7' : '#122C4B';
  const primaryBorder = isDarkMode ? '#7095A7' : '#F6CA31';
  const contentBg = isDarkMode ? '#1E202A' : 'white';
  const colorLink = isDarkMode ? '#F3CB28' : '#1677ff';
  const colorLinkActive = isDarkMode ? '#FBE9AC' : '#1677ff';
  const colorWarningBg = isDarkMode ? '#F6CA31' : '#fffbe6';

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
          colorText,
          fontSize: 18,
          fontSizeHeading5: 25,
          fontSizeHeading4: 29,
          fontSizeHeading3: 33,
          fontSizeHeading2: 37,
          fontSizeHeading1: 45,
          fontFamily: 'Open Sans',
          colorLink,
          colorLinkHover: colorLinkActive,
          colorLinkActive,
          colorWarningBg,
        },
        components: {
          Layout: {
            bodyBg: activeBackground,
            footerBg: activeBackground,
            headerBg: activeBackground,
            headerColor: colorText,
            headerHeight: '47px',
            headerPadding: '12.73px 10',
            lightTriggerColor: colorText,
            siderBg: activeBackground,
            triggerBg: activeBackground,
            triggerColor: colorText,
          },
          Menu: {
            subMenuItemBg: activeBackground,
            itemPaddingInline: '20px',
            itemMarginInline: '0',
            itemSelectedColor: colorText,
            itemColor: colorText,
            itemBorderRadius: '0',
            itemActiveBg: mildShadow,
            itemActiveColor: colorText,
            subMenuItemSelectedColor: colorText,
            itemSelectedBg: itemSelected,
            groupTitleColor: mildBlue,
            subMenuItemBorderRadius: '0',
            horizontalItemHoverColor: mildShadow,
            horizontalItemSelectedColor: 'transparent',
          },
          Button: {
            defaultActiveBorderColor: activeBorder,
            defaultBg: activeBackground,
            defaultBorderColor: activeBorder,
            defaultHoverBorderColor: activeBorder,
            defaultHoverColor: colorText,
            defaultHoverBg: shadow,
            defaultShadow: '0',
            primaryColor,
            primaryShadow: '0',
            colorPrimaryBorder: primaryBorder,
          },
          Typography: {
            colorText,
            titleMarginBottom: '20px',
          },
          Tabs: {
            inkBarColor: colorText,
            itemActiveColor: colorText,
            itemColor: mildBlue,
            itemHoverColor: colorText,
          },
          Collapse: {
            contentPadding: isBiggerThanSmallScreen ? '20px' : '7px 10px',
            headerBg: activeBackground,
            headerPadding: isBiggerThanSmallScreen ? '20px' : '7px 10px',
            colorBorder: mildShadow,
            contentBg,
            fontSize: isBiggerThanSmallScreen ? 20 : 18,
            colorText,
          },
          Card: {
            extraColor: colorText,
            actionsLiMargin: '12px 5px',
            actionsBg: contentBg,
            headerBg: contentBg,
            ...(isBiggerThanSmallScreen ? {} : {
              bodyPadding: '7px 10px',
              headerFontSize: 18,
              headerPadding: 10,
            }),
          },
          InputNumber: {
            controlWidth: '100%',
            activeBorderColor: colorText,
            hoverBorderColor: colorText,
            colorText,
          },
          Input: {
            activeBorderColor: colorText,
            hoverBorderColor: colorText,
            colorText,
          },
          Message: {
            margin: 'auto 0',
          },
          Progress: {
            defaultColor: colorText,
          },
          Table: {
            headerBg: activeBackground,
            borderColor: mildShadow,
            headerColor: mildBlue,
            footerBg: activeBackground,
            rowExpandedBg: contentBg,
            rowHoverBg: activeBackground,
            rowSelectedHoverBg: activeBackground,
            rowSelectedBg: activeBackground,
          },
          Divider: {
            marginLG: isBiggerThanSmallScreen ? '24px' : '8px',
          },
          List: {
            itemPaddingSM: isBiggerThanSmallScreen ? '8px 16px' : '8px 10px',
          },
        },
      }}
    >
      <ModeContext.Provider value={context}>
        {children}
      </ModeContext.Provider>
    </ConfigProvider>
  );
}

AntdProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
