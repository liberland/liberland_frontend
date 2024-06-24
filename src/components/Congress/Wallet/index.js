import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { congressActions, officesActions } from '../../../redux/actions';
import { congressSelectors, officesSelectors } from '../../../redux/selectors';
import WalletCongresSenateWrapper from '../../WalletCongresSenate/Wrapper';

export default function Wallet() {
  const dispatch = useDispatch();

  const pallets = useSelector(officesSelectors.selectorPallets);
  const totalBalance = useSelector(congressSelectors.totalBalance);
  const liquidMerits = useSelector(congressSelectors.liquidMeritsBalance);
  const congresAccountAddress = useSelector(congressSelectors.walletAddress);
  const additionalAssets = useSelector(congressSelectors.additionalAssets);

  const balances = useSelector(congressSelectors.balances);

  useEffect(() => {
    dispatch(officesActions.getPalletIds.call());
  }, [dispatch]);

  useEffect(() => {
    dispatch(congressActions.congressGetWallet.call());
  }, [dispatch, pallets]);

  useEffect(() => {
    dispatch(congressActions.congressGetAdditionalAssets.call());
  }, [dispatch, congresAccountAddress]);

  if (!congresAccountAddress || !balances) return null;

  return (
    <div>
      <WalletCongresSenateWrapper
        totalBalance={totalBalance}
        congresAccountAddress={congresAccountAddress}
        liquidMerits={liquidMerits}
        additionalAssets={additionalAssets}
        balances={balances}
        onSendFunctions={{
          LLD: (data) => congressActions.congressSendLld.call(data),
          LLM: (data) => congressActions.congressSendLlm.call(data),
          LLMPolitipool: (data) => congressActions.congressSendLlmToPolitipool.call(data),
        }}
      />
    </div>
  );
}
