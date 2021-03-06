// LIBS
import React from 'react';
import { ScaleLoader } from 'react-spinners';
import { useSelector } from 'react-redux';

// REDUX
import {
  userSelectors, walletSelectors, votingSelectors, assemblySelectors, lawSelectors,
} from '../../redux/selectors';

// eslint-disable-next-line react/prop-types
const Loader = ({ children }) => {
  const isSignInFetching = useSelector(userSelectors.selectIsSignInFetching);
  const isGettingWalletInfo = useSelector(walletSelectors.selectorGettingWalletInfo);
  const isVotingRequested = useSelector(votingSelectors.selectorIsVotingRequested);
  const isisDraftSend = useSelector(assemblySelectors.isDraftSendSelector);
  const isGetLaw = useSelector(lawSelectors.isGetLawsSelector);

  const isLoading = [
    isSignInFetching,
    isGettingWalletInfo,
    isVotingRequested,
    isisDraftSend,
    isGetLaw,
  ].some((isFetching) => isFetching);

  return (
    <div style={{ position: 'relative' }}>
      { isLoading
        && (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 9999999,
              background: 'rgba(211,211,211,0.6)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ScaleLoader
              loading={isLoading}
              css={{
                margin: '0 auto',
                display: 'block',
              }}
              height={60}
              width={6}
              radius={3}
              margin={3}
              color="#8C64B5"
            />
          </div>
        )}
      { children }
    </div>
  );
};

export default Loader;
