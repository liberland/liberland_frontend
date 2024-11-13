import React from 'react';
import {
  Header,
  Layout as LayoutInternal,
  Content,
  Footer,
} from 'antd/es/layout/layout';
import Menu from 'antd/es/menu';
import Sider from 'antd/es/layout/Sider';
import ConfigProvider from 'antd/es/config-provider';
import PropTypes from 'prop-types';

import HomeHeader from '../Home/HomeHeader';
import styles from './styles.module.scss';

function Layout({ children }) {
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
        <Header className={styles.header}>
          <HomeHeader />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            items={items1}
            className={styles.menu}
          />
        </Header>
        <LayoutInternal>
          <Sider width={200} breakpoint="md">
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
              items={items2}
            />
          </Sider>
          <LayoutInternal style={{ padding: '30px 35px' }}>
            <Content
              style={{
                margin: 0,
                minHeight: 280,
              }}
            >
              {children}
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              About
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
