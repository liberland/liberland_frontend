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
import { useMediaQuery } from 'usehooks-ts';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ChangeWallet from '../Home/ChangeWallet';
import styles from './styles.module.scss';
import { footerLinks, navigationList, socials } from '../../constants/navigationList';
import LiberlandLettermark from '../../assets/icons/Liberland_Lettermark.svg';
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
  const openKeys = React.useMemo(() => {
    const matchOpen = navigationList.find(
      ({ subLinks }) => Object.values(subLinks).some((sub) => sub === pathname),
    );
    return {
      citizen: true,
      state: true,
      [matchOpen ? matchOpen.route : pathname]: true,
    };
  }, [pathname]);

  const isBiggerThanDesktop = useMediaQuery('(min-width: 992px)');

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
        },
      }}
    >
      <LayoutInternal>
        <HeaderInternal className={styles.header}>
          <img alt="logo" src={LiberlandLettermark} className={styles.logo} />
          <div className={styles.version}>
            Blockchain
            <br />
            Dashboard 2.0
          </div>
          <div className={styles.user}>
            <ChangeWallet />
          </div>
        </HeaderInternal>
        <LayoutInternal>
          <Sider width={250} breakpoint="md" collapsedWidth="100px">
            <Menu
              mode="inline"
              className={styles.sider}
              defaultOpenKeys={isBiggerThanDesktop ? Object.keys(openKeys) : undefined}
              defaultSelectedKeys={[pathname]}
              items={[
                {
                  label: 'For Citizens',
                  key: 'citizen',
                  children: navigationList.filter(({ isGovt }) => !isGovt).map(createMenu),
                },
                {
                  label: 'For State Officials',
                  key: 'state',
                  children: navigationList.filter(({ isGovt }) => isGovt).map(createMenu),
                },
              ]}
            />
          </Sider>
          <LayoutInternal>
            <Content className={styles.content}>
              {children}
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
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title} className={styles.footerItem}>
                  <Menu
                    mode="inline"
                    openKeys={isBiggerThanDesktop ? [title] : undefined}
                    items={[{
                      label: title,
                      key: title,
                      expandIcon: isBiggerThanDesktop ? () => null : undefined,
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
              </div>
              <div className={classNames(styles.footerItem, styles.center)}>
                To Live and let Live
              </div>
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
