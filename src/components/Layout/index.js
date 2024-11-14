import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import LayoutInternal, {
  Header as HeaderInternal,
  Content,
  Footer,
} from 'antd/es/layout/layout';
import Menu from 'antd/es/menu';
import Sider from 'antd/es/layout/Sider';
import ConfigProvider from 'antd/es/config-provider';
import PropTypes from 'prop-types';

import ChangeWallet from '../Home/ChangeWallet';
import styles from './styles.module.scss';
import { footerLinks, navigationList } from '../../constants/navigationList';
import LiberlandLettermark from '../../assets/icons/Liberland_Lettermark.svg';

function Layout({ children }) {
  const history = useHistory();
  const createMenu = (navigation) => ({
    icon: <img src={navigation.icon} alt="icon" className={styles.icon} />,
    dashed: navigation.isDiscouraged,
    label: navigation.title,
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
          <Sider width={250} breakpoint="md">
            <Menu
              mode="inline"
              className={styles.sider}
              openKeys={['citizen', 'state', path]}
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
