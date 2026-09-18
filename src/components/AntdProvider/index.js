import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import theme from 'antd/es/theme';
import ConfigProvider from 'antd/es/config-provider';
import { useMediaQuery } from 'usehooks-ts';
import {
  DESIGNS, getSelectedDesign, persistDesign, applyDesignAttribute,
  getStoredTheme, persistTheme, nativeThemeIsDark,
} from '../../utils/designLanguage';

const { defaultAlgorithm, darkAlgorithm } = theme;

const ModeContext = createContext();

export const useModeContext = () => useContext(ModeContext);

export default function AntdProvider({ children }) {
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 992px)');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  // A stored choice wins; otherwise follow the operating system.
  const storedTheme = getStoredTheme();
  const [isDarkMode, setIsDarkModeState] = useState(
    storedTheme ? storedTheme === 'dark' : prefersDarkMode,
  );
  const [design, setDesignState] = useState(getSelectedDesign);

  const setIsDarkMode = useCallback((next) => {
    persistTheme(next);
    setIsDarkModeState(next);
  }, []);

  // Persisted so a chosen design language survives reloads and sessions until
  // the citizen changes it again.
  const setDesign = useCallback((next) => {
    persistDesign(next);
    setDesignState(next);
    // Each language has a native canvas — State is a dark language, Ledger a
    // light one. Choosing one lands you in it, persisted, so it survives
    // navigation; the moon toggle still overrides afterwards.
    setIsDarkMode(nativeThemeIsDark(next));
  }, [setIsDarkMode]);
  const isState = design === DESIGNS.state.key;

  const context = useMemo(
    () => ({
      isDarkMode, setIsDarkMode, design, setDesign, isStateDesign: isState,
    }),
    [isDarkMode, setIsDarkMode, design, setDesign, isState],
  );

  useLayoutEffect(() => {
    document.getElementsByTagName('html')[0].setAttribute('dark-mode', isDarkMode ? 'yes' : 'no');
  }, [isDarkMode]);

  // The stylesheet keys every token off this attribute, so switching it
  // repaints the whole app without touching a single component.
  useLayoutEffect(() => {
    applyDesignAttribute(design);
  }, [design]);

  // Design system color tokens
  // Palette per design language. Ledger = warm parchment; State = near-black
  // with the #FFC800 state yellow. Four-way pick keeps each token on one line
  // without nesting ternaries.
  const pick = (stateDark, stateLight, ledgerDark, ledgerLight) => {
    if (isState) return isDarkMode ? stateDark : stateLight;
    return isDarkMode ? ledgerDark : ledgerLight;
  };
  const colorText = pick('#F6F5F2', '#0A0A0B', '#F3EEE1', '#1C1813');
  const colorTextSecond = pick('#B8B6AE', '#57554F', '#ABA391', '#5C564B');
  const colorBg = pick('#16171A', '#FFFFFF', '#1C1913', '#FFFFFF');
  const colorBgContainer = pick('#16171A', '#FFFFFF', '#1C1913', '#FFFFFF');
  const colorBgLayout = pick('#0A0A0B', '#F6F5F2', '#121009', '#F4F0E6');
  const colorBorder = pick('rgba(255,200,0,.20)', 'rgba(10,10,11,.13)', '#2E2A1E', '#E7E0D0');
  const colorGold = pick('#FFC800', '#8A6A00', '#E6BA56', '#9A7320');
  const colorGoldBright = pick('#FFD84D', '#E6B400', '#F4CE73', '#C99A3A');
  const colorGoldTint = pick('rgba(255,200,0,.10)', 'rgba(255,200,0,.24)', '#2C2614', '#F3E9D0');
  const colorGreen = pick('#6ECB4F', '#2F6B33', '#5CB98A', '#2C7A57');
  const colorRed = pick('#C9705A', '#6B2F1F', '#E07F66', '#BB4632');
  const colorLink = pick('#FFC800', '#8A6A00', '#E6BA56', '#9A7320');
  const colorLinkActive = pick('#FFD84D', '#6E5500', '#F4CE73', '#C99A3A');
  const colorWarningBg = isDarkMode ? '#2C2614' : '#FAF4E4';
  const contentBg = pick('#0A0A0B', '#F6F5F2', '#121009', '#F4F0E6');
  const mildBlue = isDarkMode ? '#766F5F' : '#948E80';
  const activeBorder = colorGold;

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
          fontFamily: isState
            ? "'Archivo', system-ui, sans-serif"
            : "'Hanken Grotesk', system-ui, sans-serif",
          // The State language is squared; the Ledger language is soft.
          borderRadius: isState ? 0 : 10,
          borderRadiusLG: isState ? 0 : 14,
          borderRadiusSM: isState ? 0 : 8,
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
            itemBorderRadius: isState ? 0 : 10,
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
            colorBorder,
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
