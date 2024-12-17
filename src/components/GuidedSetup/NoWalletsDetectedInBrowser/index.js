import React, { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';
import subwalletBrowserHighlightImage from '../../../assets/images/subwallet-browser-highlight.png';
import subwalletSearchHighlightImage from '../../../assets/images/subwallet-search-highlight.png';
import Button from '../../Button/Button';
import styles from './styles.module.scss';
import { authActions } from '../../../redux/actions';

function NoWalletsDetectedInBrowser() {
  const isMedium = useMediaQuery('(min-width: 48em)');
  const { logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    logOut();
    dispatch(authActions.signOut.call(history));
    window.location.href = `
    ${process.env.REACT_APP_SSO_API}/logout?redirect=${process.env.REACT_APP_FRONTEND_REDIRECT}`;
  };

  return (
    <div>
      <h2>No wallet</h2>
      <p>No wallet was detected.</p>
      {isMedium ? (
        <div>
          <p>
            You need to have a wallet extension like polkadotjs or subwallet to
            proceed
          </p>
          <br />
          <p>
            If you have the extension, make sure its enabled and a wallet is
            available for use on any chain.
          </p>
        </div>
      ) : (
        <p>
          You need to visit this site inside a dApp explorer
          <a href={process.env.REACT_APP_SUBWALLET_LINK}>
            {' '}
            <b>Open in Subwallet</b>
          </a>
        </p>
      )}
      <br />
      <p>
        <a href="https://docs.liberland.org/public-documents/blockchain/for-citizens/onboarding">
          Read the guide for details
        </a>
      </p>
      <br />
      {isMedium ? (
        <div />
      ) : (
        <div>
          <img
            src={subwalletBrowserHighlightImage}
            className={styles.img}
            alt="subwalletBrowserHighlightImage"
          />
          <br />
          <img
            src={subwalletSearchHighlightImage}
            className={styles.img}
            alt="subwalletSearchHighlightImage"
          />
        </div>
      )}
      <div className={styles.buttonWrapper}>
        <Button
          className={styles.button}
          primary
          medium
          onClick={() => handleLogout()}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

export default NoWalletsDetectedInBrowser;
