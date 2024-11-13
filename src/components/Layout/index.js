import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  Header as HeaderInternal,
  Layout as LayoutInternal,
  Content,
  Footer,
} from 'antd/es/layout/layout';
import Menu from 'antd/es/menu';
import Sider from 'antd/es/layout/Sider';
import ConfigProvider from 'antd/es/config-provider';
import PropTypes from 'prop-types';

import ChangeWallet from '../Home/ChangeWallet';
import styles from './styles.module.scss';
import Header from '../AuthComponents/Header';
import { footerLinks, navigationList } from '../../constants/navigationList';

function Layout({ children }) {
  const history = useHistory();
  const createMenu = (navigation) => ({
    icon: navigation.icon,
    dashed: navigation.isDiscouraged,
    label: [navigation.title[0], ...navigation.title.slice(1).map((c) => c.toLowerCase())].join(''),
    key: navigation.route,
    children: Object.entries(navigation.subLinks).map(([name, link]) => ({
      label: name,
      onClick: () => history.push(link),
    })),
  });

  const { path } = useRouteMatch();

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
            headerPadding: '12.73px 0',
            lightTriggerColor: '#243F5F',
            siderBg: 'white',
            triggerBg: 'white',
            triggerColor: '#243F5F',
          },
        },
      }}
    >
      <LayoutInternal>
        <HeaderInternal className={styles.header}>
          <Header />
          <div className={styles.version}>
            Blockchain
            <br />
            Dashboard 2.0
          </div>
          <ChangeWallet />
        </HeaderInternal>
        <LayoutInternal>
          <Sider width={200} breakpoint="md">
            <Menu
              mode="inline"
              className={styles.sider}
              selectedKeys={[path]}
              items={[
                {
                  label: 'For Citizens',
                  children: navigationList.filter(({ isGovt }) => !isGovt).map(createMenu),
                },
                {
                  label: 'For State Officials',
                  children: navigationList.filter(({ isGovt }) => isGovt).map(createMenu),
                },
              ]}
            />
          </Sider>
          <LayoutInternal className={styles.contentContainer}>
            <Content className={styles.content}>
              {children}
            </Content>
            <Footer className={styles.footer}>
              {Object.entries(footerLinks).map(([title, links], index) => (
                <div key={title}>
                  <label className={styles.footerTitle} htmlFor={`footer-${index}`}>
                    {title}
                  </label>
                  <Menu
                    id={`footer-${index}`}
                    mode="inline"
                    items={Object.entries(links).map(([name, url]) => ({
                      label: name,
                      onClick: () => {
                        window.location.href = url;
                      },
                    }))}
                  />
                </div>
              ))}
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
