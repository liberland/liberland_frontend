import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Flex from 'antd/es/flex';
import { ministryFinanceActions, officesActions } from '../../../redux/actions';
import { blockchainSelectors, ministryFinanceSelector, officesSelectors } from '../../../redux/selectors';
import WalletCongresSenateWrapper from '../../WalletCongresSenate/Wrapper';
import { OfficeType } from '../../../utils/officeTypeEnum';
import SpendingTable from '../../SpendingTable';

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
  const spending = useSelector(ministryFinanceSelector.spendingSelector);
  const spendingCount = useSelector(ministryFinanceSelector.spendingCountSelector);
  const isLoading = useSelector(ministryFinanceSelector.isLoading);
  const userIsMember = clerksIds?.includes(walletAddress) || false;
  const loadMore = (page, pageSize) => {
    const from = spending ? spending.from : 0;
    const skip = (page - 1) * pageSize;
    if (from === 0 || from < skip) {
      dispatch(ministryFinanceActions.ministryFinanceSpending.call({ skip, take: pageSize }));
    }
  };

  useEffect(() => {
    dispatch(ministryFinanceActions.ministryFinanceSpendingCount.call());
    loadMore(1, 10);
    dispatch(officesActions.getPalletIds.call());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Should only run on mount

  useEffect(() => {
    dispatch(ministryFinanceActions.ministryFinanceGetWallet.call());
  }, [dispatch, pallets]);

  useEffect(() => {
    dispatch(ministryFinanceActions.ministryFinanceGetAdditionalAssets.call());
  }, [dispatch, ministryFinanceWallet]);

  if (!ministryFinanceWallet) {
    return null;
  }

  return (
    <Flex vertical gap="20px">
      <WalletCongresSenateWrapper
        userIsMember={userIsMember}
        totalBalance={totalBalance}
        congressAccountAddress={ministryFinanceWallet}
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
      {spending && spendingCount ? (
        <SpendingTable
          spending={spending.data}
          onNext={loadMore}
          total={spendingCount}
          isLoading={isLoading}
        />
      ) : null}
    </Flex>
  );
}
