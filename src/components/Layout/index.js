import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { walletActions } from '../../redux/actions';
import { HideTitleProvider } from './HideTitle';
import ScrollContainer from './ScrollContainer';
import styles from './styles.module.scss';
import Header from './Header';
import Sider from './Sider';
import Socials from './Socials';
import FooterLinks from './FooterLinks';
import Copyright from './Copyright';
import Tabs from './Tabs';

function Layout({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(walletActions.getWallet.call());
  }, [dispatch]);

  return (
    <div className={styles.shell}>
      <Sider />
      <div className={styles.main}>
        <Header />
        <ScrollContainer>
          <div className={styles.content}>
            <Tabs />
            <HideTitleProvider>
              {children}
            </HideTitleProvider>
          </div>
        </ScrollContainer>
        <footer className={styles.footer}>
          <div className={styles.footerItem}>
            <Socials />
          </div>
          <FooterLinks />
          <Copyright />
        </footer>
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
