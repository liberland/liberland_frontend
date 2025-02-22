import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Flex from 'antd/es/flex';
import { ministryFinanceActions, officesActions } from '../../../redux/actions';
import { blockchainSelectors, ministryFinanceSelector, officesSelectors } from '../../../redux/selectors';
import WalletCongresSenateWrapper from '../../WalletCongresSenate/Wrapper';
import { OfficeType } from '../../../utils/officeTypeEnum';
import SpendingTable from '../../SpendingTable';
import { paginator } from '../../../utils/pagination';

const pageSize = 10;

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
  const userIsMember = clerksIds?.includes(walletAddress) || false;

  const loadMore = useCallback(({ skip }) => (
    dispatch(ministryFinanceActions.ministryFinanceSpending.call({ skip, take: pageSize }))
  ), [dispatch]);

  useEffect(() => {
    dispatch(ministryFinanceActions.ministryFinanceSpendingCount.call());
    loadMore({ skip: 0 });
    dispatch(ministryFinanceActions.ministryFinanceSpendingCount.call());
    dispatch(officesActions.getPalletIds.call());
  }, [loadMore, dispatch]);

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
      {spending && spendingCount && (
        <SpendingTable
          spending={spending}
          onNext={paginator(
            pageSize,
            spending.length,
            spendingCount,
            loadMore,
          )}
        />
      )}
    </Flex>
  );
}
