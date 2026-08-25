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

  // Design system color tokens
  const colorText         = isDarkMode ? '#F3EEE1' : '#1C1813';
  const colorTextSecond   = isDarkMode ? '#ABA391' : '#5C564B';
  const colorBg           = isDarkMode ? '#1C1913' : '#FFFFFF';
  const colorBgContainer  = isDarkMode ? '#1C1913' : '#FFFFFF';
  const colorBgLayout     = isDarkMode ? '#121009' : '#F4F0E6';
  const colorBorder       = isDarkMode ? '#2E2A1E' : '#E7E0D0';
  const colorGold         = isDarkMode ? '#E6BA56' : '#9A7320';
  const colorGoldBright   = isDarkMode ? '#F4CE73' : '#C99A3A';
  const colorGoldTint     = isDarkMode ? '#2C2614' : '#F3E9D0';
  const colorGreen        = isDarkMode ? '#5CB98A' : '#2C7A57';
  const colorRed          = isDarkMode ? '#E07F66' : '#BB4632';
  const colorLink         = isDarkMode ? '#E6BA56' : '#9A7320';
  const colorLinkActive   = isDarkMode ? '#F4CE73' : '#C99A3A';
  const colorWarningBg    = isDarkMode ? '#2C2614' : '#FAF4E4';
  const contentBg         = isDarkMode ? '#121009' : '#F4F0E6';
  const shadow            = isDarkMode ? '#2E2A1E' : '#E7E0D0';
  const mildBlue          = isDarkMode ? '#766F5F' : '#948E80';
  const activeBorder      = colorGold;

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
          colorTextBase: colorText,
          colorBgBase: colorBg,
          colorBgContainer,
          colorBgLayout,
          colorBorder,
          colorPrimary: colorGold,
          colorPrimaryHover: colorGoldBright,
          colorSuccess: colorGreen,
          colorError: colorRed,
          colorWarning: colorGold,
          colorLink,
          colorLinkHover: colorLinkActive,
          colorLinkActive,
          colorWarningBg,
          fontSize: 15,
          fontSizeHeading5: 17,
          fontSizeHeading4: 20,
          fontSizeHeading3: 24,
          fontSizeHeading2: 29,
          fontSizeHeading1: 36,
          fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
          borderRadius: 10,
          borderRadiusLG: 14,
          borderRadiusSM: 8,
          wireframe: false,
        },
        components: {
          Layout: {
            bodyBg: colorBgLayout,
            footerBg: colorBgContainer,
            headerBg: colorBgContainer,
            headerColor: colorText,
            headerHeight: 64,
            headerPadding: '0 32px',
            lightTriggerColor: colorText,
            siderBg: colorBgContainer,
            triggerBg: colorBgContainer,
            triggerColor: colorText,
          },
          Menu: {
            subMenuItemBg: colorBgContainer,
            itemPaddingInline: '12px',
            itemMarginInline: '0',
            itemSelectedColor: colorText,
            itemColor: colorTextSecond,
            itemBorderRadius: 10,
            itemActiveBg: colorGoldTint,
            itemActiveColor: colorText,
            subMenuItemSelectedColor: colorText,
            itemSelectedBg: colorGoldTint,
            groupTitleColor: mildBlue,
            subMenuItemBorderRadius: 10,
            horizontalItemHoverColor: colorText,
            horizontalItemSelectedColor: colorText,
          },
          Button: {
            defaultActiveBorderColor: activeBorder,
            defaultBg: colorBgContainer,
            defaultBorderColor: colorBorder,
            defaultHoverBorderColor: colorGold,
            defaultHoverColor: colorText,
            defaultHoverBg: colorGoldTint,
            defaultShadow: '0',
            primaryColor: isDarkMode ? '#1A1305' : '#211904',
            primaryShadow: '0',
            colorPrimaryBorder: colorGold,
            colorPrimary: colorGold,
            colorPrimaryHover: colorGoldBright,
          },
          Typography: {
            colorText,
            titleMarginBottom: '16px',
            fontFamilyCode: "'JetBrains Mono', ui-monospace, monospace",
          },
          Tabs: {
            inkBarColor: colorGold,
            itemActiveColor: colorText,
            itemColor: mildBlue,
            itemHoverColor: colorText,
            itemSelectedColor: colorText,
            cardBg: colorBgContainer,
          },
          Collapse: {
            contentPadding: isBiggerThanSmallScreen ? '20px' : '12px',
            headerBg: colorBgContainer,
            headerPadding: isBiggerThanSmallScreen ? '16px 20px' : '12px',
            colorBorder: colorBorder,
            contentBg,
            fontSize: 15,
            colorText,
          },
          Card: {
            extraColor: colorText,
            actionsLiMargin: '12px 5px',
            actionsBg: contentBg,
            headerBg: colorBgContainer,
            colorBorderSecondary: colorBorder,
            ...(isBiggerThanSmallScreen ? {} : {
              bodyPadding: '12px 16px',
              headerFontSize: 16,
              headerPadding: 14,
            }),
          },
          InputNumber: {
            controlWidth: '100%',
            activeBorderColor: colorGold,
            hoverBorderColor: colorGold,
            colorText,
          },
          Input: {
            activeBorderColor: colorGold,
            hoverBorderColor: colorGold,
            colorText,
            colorBgContainer,
          },
          Select: {
            colorBgContainer,
            optionSelectedBg: colorGoldTint,
            optionActiveBg: colorGoldTint,
          },
          Message: {
            margin: 'auto 0',
          },
          Progress: {
            defaultColor: colorGold,
            colorSuccess: colorGreen,
          },
          Table: {
            headerBg: colorBgContainer,
            borderColor: colorBorder,
            headerColor: mildBlue,
            footerBg: colorBgContainer,
            rowExpandedBg: colorBgContainer,
            rowHoverBg: colorGoldTint,
            rowSelectedHoverBg: colorGoldTint,
            rowSelectedBg: colorGoldTint,
            colorBgContainer,
          },
          Divider: {
            colorSplit: colorBorder,
            marginLG: isBiggerThanSmallScreen ? '24px' : '8px',
          },
          List: {
            itemPaddingSM: isBiggerThanSmallScreen ? '10px 16px' : '8px 12px',
          },
          Tag: {
            defaultBg: colorGoldTint,
            defaultColor: colorText,
          },
          Badge: {
            colorPrimary: colorGold,
          },
          Alert: {
            defaultPadding: '12px 16px',
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
