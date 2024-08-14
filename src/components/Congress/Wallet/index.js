import React from 'react';
import { useSelector } from 'react-redux';
import { congressActions } from '../../../redux/actions';
import { congressSelectors } from '../../../redux/selectors';
import WalletCongresSenateWrapper from '../../WalletCongresSenate/Wrapper';

export default function Wallet() {
  const totalBalance = useSelector(congressSelectors.totalBalance);
  const liquidMerits = useSelector(congressSelectors.liquidMeritsBalance);
  const congresAccountAddress = useSelector(congressSelectors.walletAddress);
  const additionalAssets = useSelector(congressSelectors.additionalAssets);

  const balances = useSelector(congressSelectors.balances);

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
