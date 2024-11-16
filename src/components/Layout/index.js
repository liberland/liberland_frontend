import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import LayoutInternal, {
  Header as HeaderInternal,
  Content,
  Footer,
} from 'antd/es/layout/layout';
import Menu from 'antd/es/menu';
import Sider from 'antd/es/layout/Sider';
import ConfigProvider from 'antd/es/config-provider';
import Paragraph from 'antd/es/typography/Paragraph';
import Button from 'antd/es/button';
import List from 'antd/es/list';
import Title from 'antd/es/typography/Title';
import Tabs from 'antd/es/tabs';
import Spin from 'antd/es/spin';
import Collapse from 'antd/es/collapse';
import MenuIcon from '@ant-design/icons/MenuOutlined';
import { useMediaQuery } from 'usehooks-ts';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ChangeWallet from '../Home/ChangeWallet';
import styles from './styles.module.scss';
import { footerLinks, navigationList, socials } from '../../constants/navigationList';
import LiberlandLettermark from '../../assets/icons/Liberland_Lettermark.svg';
import LiberlandLettermarkMobile from '../../assets/icons/Liberland_Lettermark_Mobile.svg';
import LiberlandSeal from '../../assets/icons/seal.svg';

function Layout({ children }) {
  const history = useHistory();
  const createMenu = (navigation) => {
    const subs = Object.entries(navigation.subLinks).map(([name, link]) => ({
      label: name,
      key: link,
      onClick: () => history.push(link),
    }));
    return {
      icon: <img src={navigation.icon} alt="icon" className={styles.icon} />,
      dashed: navigation.isDiscouraged,
      label: navigation.title,
      key: navigation.route,
      onClick: subs.length ? undefined : () => history.push(navigation.route),
      children: subs.length ? subs : undefined,
    };
  };

  const { pathname } = useLocation();
  const matchedSubLink = React.useMemo(() => navigationList.find(
    ({ subLinks }) => (
      Object.values(subLinks).some((sub) => sub === pathname)
        || Object.values(subLinks).some((sub) => pathname.startsWith(sub))
    ),
  ), [pathname]);
  const matchedRoute = React.useMemo(
    () => navigationList.find(({ route }) => route === pathname)
      || navigationList.find(({ route }) => pathname.startsWith(route)),
    [pathname],
  );

  const pageTitle = React.useMemo(() => {
    if (matchedSubLink && !matchedSubLink.hideTitle) {
      return matchedSubLink.title;
    }
    if (matchedRoute && !matchedRoute.hideTitle) {
      return matchedRoute.title;
    }
    return '';
  }, [matchedSubLink, matchedRoute]);

  const tabs = React.useMemo(() => {
    if (matchedSubLink) {
      return Object.entries(matchedSubLink.subLinks);
    }
    if (matchedRoute) {
      return Object.entries(matchedRoute.subLinks);
    }
    return [];
  }, [matchedSubLink, matchedRoute]);

  const hasTab = tabs.find(([_, url]) => url === pathname);

  const openKeys = React.useMemo(() => {
    const matchOpen = matchedSubLink;
    return {
      citizen: true,
      state: true,
      [matchOpen ? matchOpen.route : pathname]: true,
    };
  }, [matchedSubLink, pathname]);

  const isBiggerThanDesktop = useMediaQuery('(min-width: 992px)');
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 576px)');

  const getMenuKey = () => {
    if (isBiggerThanDesktop) {
      return 'large';
    }
    if (isBiggerThanSmallScreen) {
      return 'desktop';
    }
    return 'small';
  };

  const footerList = Object.entries(footerLinks);

  const urlMenu = (
    <Sider width={250} breakpoint="md" collapsedWidth="60px">
      <Menu
        mode="inline"
        className={styles.sider}
        defaultOpenKeys={isBiggerThanDesktop ? Object.keys(openKeys) : undefined}
        selectedKeys={[pathname]}
        key={getMenuKey()}
        items={[
          {
            label: isBiggerThanSmallScreen ? 'For Citizens' : 'Menu',
            icon: isBiggerThanSmallScreen ? undefined : React.createElement(MenuIcon),
            key: 'citizen',
            children: navigationList.filter(({ isGovt }) => !isBiggerThanSmallScreen || !isGovt).map(createMenu),
          },
        ].concat(isBiggerThanSmallScreen ? [
          {
            label: 'For State Officials',
            key: 'state',
            children: navigationList.filter(({ isGovt }) => isGovt).map(createMenu),
          },
        ] : [])}
      />
    </Sider>
  );

  return (
    <ConfigProvider
      theme={{
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
          },
          Button: {
            defaultActiveBorderColor: '#243F5F',
            defaultBg: 'white',
            defaultBorderColor: '#ECEBF0',
            defaultHoverBorderColor: '#243F5F',
            defaultHoverColor: '243F5F',
            defaultShadow: '0',
            primaryColor: 'white',
            primaryShadow: '0',
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
          },
        },
      }}
    >
      <LayoutInternal>
        <HeaderInternal className={styles.header}>
          {isBiggerThanSmallScreen ? (
            <>
              <img alt="logo" src={LiberlandLettermark} className={styles.logo} />
              <div className={styles.version}>
                Blockchain
                <br />
                Dashboard 2.0
              </div>
            </>
          ) : (
            <>
              {urlMenu}
              <img alt="logo" src={LiberlandLettermarkMobile} className={styles.mobileLogo} />
            </>
          )}
          <div className={styles.user}>
            <ChangeWallet />
          </div>
        </HeaderInternal>
        <LayoutInternal>
          {isBiggerThanSmallScreen && urlMenu}
          <LayoutInternal>
            <Content className={styles.content}>
              {pageTitle && (
                <Title level={1} className={styles.pageTitle}>{pageTitle}</Title>
              )}
              {tabs?.length && hasTab ? (
                <Tabs
                  activeKey={pathname}
                  onChange={(activeKey) => {
                    history.push(activeKey);
                  }}
                  items={tabs.map(([title, url]) => ({
                    key: url,
                    label: title,
                    children: pathname === url ? children : <Spin size="large" />,
                  }))}
                />
              ) : children}
            </Content>
            <Footer className={styles.footer}>
              <div className={styles.footerItem}>
                <img src={LiberlandSeal} alt="seal of liberland" className={styles.seal} />
                <Paragraph>
                  Free Republic of Liberland is a sovereign state & constitutional
                  republic with elements of direct democracy.
                </Paragraph>
                <List
                  grid={{ gutter: 10, column: 5 }}
                  dataSource={socials}
                  renderItem={({
                    icon,
                    label,
                    href,
                  }) => (
                    <a href={href} aria-label={label}>
                      <img src={icon} alt="icon" className={styles.social} />
                    </a>
                  )}
                />
              </div>
              <List
                grid={{ gutter: 10, column: footerList.length }}
                dataSource={footerList}
                renderItem={([title, links]) => (
                  <Collapse
                    key={title}
                    expandIcon={isBiggerThanSmallScreen ? () => null : undefined}
                    activeKey={isBiggerThanSmallScreen ? [title] : undefined}
                    dataSource={[{
                      key: title,
                      label: title,
                      children: (
                        <Menu
                          mode="inline"
                          items={Object.entries(links).map(([name, url]) => ({
                            label: name,
                            key: name,
                            onClick: () => {
                              window.location.href = url;
                            },
                          }))}
                        />
                      ),
                    }]}
                  />
                )}
              />
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title} className={styles.footerItem}>
                  <Menu
                    mode="inline"
                    openKeys={isBiggerThanSmallScreen ? [title] : undefined}
                    items={[{
                      label: title,
                      key: title,
                      expandIcon: isBiggerThanSmallScreen ? () => null : undefined,
                      children: Object.entries(links).map(([name, url]) => ({
                        label: name,
                        key: name,
                        onClick: () => {
                          window.location.href = url;
                        },
                      })),
                    }]}
                  />
                </div>
              ))}
            </Footer>
            <Footer className={styles.footer}>
              <div className={styles.footerItem}>
                ©2023 Liberland. All right reserved.
                {!isBiggerThanSmallScreen && <div className={styles.slogan}>To Live and let Live</div>}
              </div>
              {isBiggerThanSmallScreen && (
                <div className={classNames(styles.footerItem, styles.center, styles.slogan)}>
                  To Live and let Live
                </div>
              )}
              <div className={styles.footerItem}>
                <Button href="https://liberland.org/contribution">
                  Donate to Liberland
                </Button>
              </div>
            </Footer>
          </LayoutInternal>
        </LayoutInternal>
      </LayoutInternal>
    </ConfigProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
