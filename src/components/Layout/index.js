import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import LayoutInternal, {
  Content,
  Footer,
} from 'antd/es/layout/layout';
import PropTypes from 'prop-types';
import { walletActions } from '../../redux/actions';
import styles from './styles.module.scss';
import Header from './Header';
import Sider from './Sider';
import Socials from './Socials';
import FooterLinks from './FooterLinks';
import Copyright from './Copyright';
import PageTitle from './PageTitle';
import Tabs from './Tabs';
import { HideTitleProvider } from './HideTitle';

function Layout({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(walletActions.getWallet.call());
  }, [dispatch]);

  return (
    <LayoutInternal>
      <Header />
      <LayoutInternal>
        <Sider />
        <LayoutInternal className={styles.contentWrapper}>
          <Content className={styles.content}>
            <HideTitleProvider>
              <PageTitle />
              <Tabs />
              {children}
            </HideTitleProvider>
          </Content>
          <Footer className={styles.footer}>
            <div className={styles.footerItem}>
              <Socials />
            </div>
            <FooterLinks />
          </Footer>
          <Footer>
            <Copyright />
          </Footer>
        </LayoutInternal>
      </LayoutInternal>
    </LayoutInternal>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
