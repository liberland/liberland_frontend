import React from 'react';
import { useMediaQuery } from 'usehooks-ts';
import subwalletBrowserHighlightImage from '../../../assets/images/subwallet-browser-highlight.png';
import subwalletSearchHighlightImage from '../../../assets/images/subwallet-search-highlight.png';

function NoWalletsDetectedInBrowser() {
  const isMedium = useMediaQuery('(min-width: 48em)');

  return (
    <div>
      <h2>No wallet</h2>
      <p>No wallet was detected.</p>
      {isMedium ? (
        <div>
          <p>You need to have a wallet extension like polkadotjs or subwallet to proceed</p>
          <br />
          <p>If you have the extension, make sure its enabled and a wallet is available for use on any chain.</p>
        </div>
      )
        : (
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
        <a
          href="https://docs.liberland.org/public-documents/blockchain/for-citizens/onboarding"
        >
          Read the guide for details
        </a>
      </p>
      <br />
      {isMedium ? (<div />)
        : (
          <div>
            <img src={subwalletBrowserHighlightImage} style={{ width: '100%' }} alt="subwalletBrowserHighlightImage" />
            <br />
            <img src={subwalletSearchHighlightImage} style={{ width: '100%' }} alt="subwalletSearchHighlightImage" />
          </div>
        )}
    </div>
  );
}

export default NoWalletsDetectedInBrowser;
