import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';
import PropTypes from 'prop-types';
import { ethSelectors } from '../../../redux/selectors';
import { ethActions } from '../../../redux/actions';
import Button from '../../../components/Button/Button';
import useThirdWebContract from '../../../hooks/useThirdWebContract';

function EthereumSelectorAddress({ onAddressSelected, selectedWallet }) {
  const dispatch = useDispatch();
  const auth = React.useContext(AuthContext);
  const [client] = useThirdWebContract();

  const select = React.useCallback(() => {
    dispatch(ethActions.getConnectedEthWallet.call({
        client: client,
        walletId: selectedWallet.id,
        clientId: auth.thirdWebClientId
    }));
  }, [dispatch]);

  const connected = useSelector(ethSelectors.selectorConnected);
  const connecting = useSelector(ethSelectors.selectorConnecting);

  React.useEffect(() => {
    onAddressSelected(connected);
  }, [connected]);

  return (
    <Button disabled={connecting} onClick={select} primary large>
        {connecting ? "Connecting..." : connected ? "Switch account" : "Connect"}
    </Button>
  );
}

EthereumSelectorAddress.propTypes = {
  onAddressSelected: PropTypes.func.isRequired,
  selectedWallet: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default EthereumSelectorAddress;
