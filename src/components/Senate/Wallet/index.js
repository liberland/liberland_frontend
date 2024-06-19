import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { officesActions, senateActions } from '../../../redux/actions';
import { officesSelectors, senateSelectors } from '../../../redux/selectors';
import WalletCongresSenateWrapper from '../../WalletCongresSenate/Wrapper';

export default function Wallet() {
  const dispatch = useDispatch();

  const pallets = useSelector(officesSelectors.selectorPallets);
  const totalBalance = useSelector(senateSelectors.totalBalance);
  const liquidMerits = useSelector(senateSelectors.liquidMeritsBalance);
  const congresAccountAddress = useSelector(senateSelectors.walletAddress);
  const additionalAssets = useSelector(senateSelectors.additionalAssets);

  const balances = useSelector(senateSelectors.balances);

  useEffect(() => {
    dispatch(officesActions.getPalletIds.call());
  }, [dispatch]);

  useEffect(() => {
    dispatch(senateActions.senateGetWallet.call());
  }, [dispatch, pallets]);

  useEffect(() => {
    dispatch(senateActions.senateGetAdditionalAssets.call());
  }, [dispatch, congresAccountAddress]);

  if (!congresAccountAddress) return null;

  return (
    <div>
      <WalletCongresSenateWrapper
        totalBalance={totalBalance}
        congresAccountAddress={congresAccountAddress}
        liquidMerits={liquidMerits}
        additionalAssets={additionalAssets}
        balances={balances}
        onSendFunctions={{
          LLD: (data) => senateActions.senateSendLld.call(data),
          LLM: (data) => senateActions.senateSendLlm.call(data),
          LLMPolitipool: (data) => senateActions.senateSendLlmToPolitipool.call(data),
        }}
      />
    </div>
  );
}
