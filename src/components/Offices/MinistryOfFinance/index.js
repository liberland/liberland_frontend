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
  const clerksIds = useSelector(ministryFinanceSelector.clerksMinistryFinance);

  useEffect(() => {
    dispatch(officesActions.getPalletIds.call());
  }, [dispatch]);

  useEffect(() => {
    dispatch(ministryFinanceActions.ministryFinanceGetWallet.call());
  }, [dispatch, pallets]);

  useEffect(() => {
    dispatch(ministryFinanceActions.ministryFinanceGetAdditionalAssets.call());
  }, [dispatch, ministryFinanceWallet]);

  if (!ministryFinanceWallet) return null;
  const userIsMember = clerksIds.includes(walletAddress);
  return (
    <div>
      <WalletCongresSenateWrapper
        userIsMember={userIsMember}
        totalBalance={totalBalance}
        congresAccountAddress={ministryFinanceWallet}
        liquidMerits={liquidMerits}
        additionalAssets={additionalAssets}
        balances={balances}
        officeType={OfficeType.MINISTRY_FINANCE}
        onSendFunctions={{
          LLD: (data) => ministryFinanceActions.ministryFinanceSendLld.call(data),
          LLM: (data) => ministryFinanceActions.ministryFinanceSendLlm.call(data),
          LLMPolitipool: (data) => ministryFinanceActions.ministryFinanceSendLlmToPolitipool.call(data),
        }}
      />
    </div>
  );
}
