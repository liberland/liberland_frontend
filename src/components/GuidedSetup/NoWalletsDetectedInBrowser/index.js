import React, { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';
import Collapse from 'antd/es/collapse';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Link from 'antd/es/typography/Link';
import subwalletBrowserHighlightImage from '../../../assets/images/subwallet-browser-highlight.png';
import subwalletSearchHighlightImage from '../../../assets/images/subwallet-search-highlight.png';
import Button from '../../Button/Button';
import styles from './styles.module.scss';
import { authActions } from '../../../redux/actions';

function NoWalletsDetectedInBrowser() {
  const { logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const isBigScreen = useMediaQuery('(min-width: 1200px)');

  const handleLogout = () => {
    logOut();
    dispatch(authActions.signOut.call(history));
    window.location.href = `
    ${process.env.REACT_APP_SSO_API}/logout?redirect=${process.env.REACT_APP_FRONTEND_REDIRECT}`;
  };

  return (
    <Flex vertical gap="20px">
      <Flex vertical>
        <Title level={2}>
          No wallet
        </Title>
        <Paragraph>
          No wallet was detected.
        </Paragraph>
        <Collapse
          key={isBigScreen ? 'big' : 'small'}
          defaultActiveKey={isBigScreen ? ['big'] : ['small']}
          items={[
            {
              key: 'big',
              label: 'Desktop instructions',
              children: (
                <>
                  <Paragraph>
                    You need to have a wallet extension like polkadotjs or subwallet to
                    proceed
                  </Paragraph>
                  <Paragraph>
                    If you have the extension, make sure its enabled and a wallet is
                    available for use on any chain.
                  </Paragraph>
                  <Paragraph>
                    <Link href="https://docs.liberland.org/blockchain/for-citizens/onboarding">
                      Read the guide for details
                    </Link>
                  </Paragraph>
                </>
              ),
            },
            {
              key: 'small',
              label: 'Mobile instructions',
              children: (
                <>
                  <Paragraph>
                    You need to visit this site inside a dApp explorer
                  </Paragraph>
                  <Paragraph>
                    <Link href="https://docs.liberland.org/blockchain/for-citizens/onboarding">
                      Read the guide for details
                    </Link>
                  </Paragraph>
                  <Paragraph>
                    <img
                      src={subwalletBrowserHighlightImage}
                      className={styles.img}
                      alt="subwalletBrowserHighlightImage"
                    />
                  </Paragraph>
                  <Paragraph>
                    <img
                      src={subwalletSearchHighlightImage}
                      className={styles.img}
                      alt="subwalletSearchHighlightImage"
                    />
                  </Paragraph>
                  <Button
                    primary
                    onClick={() => {
                      window.location.href = process.env.REACT_APP_SUBWALLET_LINK;
                    }}
                  >
                    Open in Subwallet
                  </Button>
                </>
              ),
            },
          ]}
        />
      </Flex>
      <Button
        className={styles.button}
        primary
        medium
        onClick={() => handleLogout()}
      >
        Logout
      </Button>
    </Flex>
  );
}

export default NoWalletsDetectedInBrowser;
