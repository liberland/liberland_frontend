import React from 'react';
import { useDispatch } from 'react-redux';
import LayoutInternal, {
  Content,
  Footer,
} from 'antd/es/layout/layout';
import ConfigProvider from 'antd/es/config-provider';
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

function Layout({ children }) {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(walletActions.getWallet.call());
  }, [dispatch]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: '#243F5F',
        },
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
            horizontalItemHoverColor: '#F2F2F2',
            horizontalItemSelectedColor: 'transparent',
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
            contentFontSize: '12px',
            paddingBlock: '10px',
            paddingInline: '5px',
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
          Card: {
            extraColor: '#243F5F',
          },
        },
      }}
    >
      <LayoutInternal>
        <Header />
        <LayoutInternal>
          <Sider />
          <LayoutInternal>
            <Content className={styles.content}>
              <PageTitle />
              <Tabs>
                {children}
              </Tabs>
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
    </ConfigProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
