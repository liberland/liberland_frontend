import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { walletActions } from '../../redux/actions';
import { HideTitleProvider } from './HideTitle';
import ScrollContainer from './ScrollContainer';
import styles from './styles.module.scss';
import Header from './Header';
import Sider from './Sider';
import Tabs from './Tabs';
import { getDocumentTitle } from '../../utils/pageTitle';

function Layout({ children }) {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    dispatch(walletActions.getWallet.call());
  }, [dispatch]);

  // Keep the browser tab in sync with the active route. A single-page app that
  // never updates document.title reports the same name on every screen, which
  // makes it impossible to confirm a navigation actually landed.
  useEffect(() => {
    document.title = getDocumentTitle(pathname);
  }, [pathname]);

  return (
    <div className={styles.shell}>
      <a href="#main-content" className={styles.skipLink}>Skip to main content</a>
      <Sider />
      <div className={styles.main}>
        <Header />
        <ScrollContainer>
          <main id="main-content" className={styles.content}>
            <Tabs />
            <HideTitleProvider>
              {children}
            </HideTitleProvider>
          </main>
        </ScrollContainer>
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
