import React from 'react';
import PropTypes from 'prop-types';
import theme from 'antd/es/theme';
import ConfigProvider from 'antd/es/config-provider';
import { useMediaQuery } from 'usehooks-ts';

const { defaultAlgorithm, darkAlgorithm } = theme;

export default function AntdProvider({ children }) {
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const colorText = isDarkMode ? 'white' : '#243F5F';
  const activeBackground = isDarkMode ? '#1E202A' : 'white';
  const mildShadow = isDarkMode ? '#7095A7' : '#F2F2F2';
  const shadow = isDarkMode ? '#7095A7' : '#EAEEF0';
  const mildBlue = isDarkMode ? '#7095A7' : '#ACBDC5';
  const activeBorder = isDarkMode ? '#7095A7' : '#CCD6DB';
  const primaryColor = isDarkMode ? '#7095A7' : '#122C4B';
  const primaryBorder = isDarkMode ? '#7095A7' : '#F6CA31';
  const contentBg = isDarkMode ? '#1E202A' : 'white';

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
          fontSizeHeading1: 41,
          fontFamily: 'Open Sans',
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
            itemSelectedBg: shadow,
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
            contentPadding: '20px',
            headerBg: activeBackground,
            headerPadding: '20px',
            colorBorder: mildShadow,
            contentBg,
            fontSize: 20,
            colorText,
          },
          Card: {
            extraColor: colorText,
            actionsLiMargin: '12px 5px',
            actionsBg: contentBg,
            headerBg: contentBg,
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
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

AntdProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
