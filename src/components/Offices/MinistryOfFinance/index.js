import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ministryFinanceActions, officesActions } from '../../../redux/actions';
import { blockchainSelectors, ministryFinanceSelector, officesSelectors } from '../../../redux/selectors';
import WalletCongresSenateWrapper from '../../WalletCongresSenate/Wrapper';
import { OfficeType } from '../../../utils/officeTypeEnum';

export default function Wallet() {
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const pallets = useSelector(officesSelectors.selectorPallets);
  const totalBalance = useSelector(ministryFinanceSelector.totalBalance);
  const liquidMerits = useSelector(ministryFinanceSelector.liquidMeritsBalance);
  const ministryFinanceWallet = useSelector(ministryFinanceSelector.walletAddress);
  const additionalAssets = useSelector(ministryFinanceSelector.additionalAssets);
  const balances = useSelector(ministryFinanceSelector.balances);
  const adminAddress = useSelector(ministryFinanceSelector.adminMinistryFinance);

  useEffect(() => {
    dispatch(officesActions.getPalletIds.call());
  }, [dispatch]);

  useEffect(() => {
    dispatch(ministryFinanceActions.getWallet.call());
  }, [dispatch, pallets]);

  useEffect(() => {
    dispatch(ministryFinanceActions.getAdditionalAssets.call());
  }, [dispatch, ministryFinanceWallet]);

  if (!ministryFinanceWallet) return null;

  return (
    <div>
      <WalletCongresSenateWrapper
        userIsMember={walletAddress === adminAddress.toString()}
        totalBalance={totalBalance}
        congresAccountAddress={ministryFinanceWallet}
        liquidMerits={liquidMerits}
        additionalAssets={additionalAssets}
        balances={balances}
        officeType={OfficeType.MINISTRY_FINANCE}
        onSendFunctions={{
          LLD: (data) => ministryFinanceActions.sendLld.call(data),
          LLM: (data) => ministryFinanceActions.sendLlm.call(data),
          LLMPolitipool: (data) => ministryFinanceActions.sendLlmToPolitipool.call(data),
        }}
      />
    </div>
  );
}
