import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import { congressActions } from '../../../redux/actions';
import { congressSelectors } from '../../../redux/selectors';
import WalletCongresSenateWrapper from '../../WalletCongresSenate/Wrapper';
import { OfficeType } from '../../../utils/officeTypeEnum';
import SpendingTable from '../../SpendingTable';

export default function Wallet() {
  const totalBalance = useSelector(congressSelectors.totalBalance);
  const liquidMerits = useSelector(congressSelectors.liquidMeritsBalance);
  const congressAccountAddress = useSelector(congressSelectors.walletAddress);
  const additionalAssets = useSelector(congressSelectors.additionalAssets);
  const userIsMember = useSelector(congressSelectors.userIsMember);
  const balances = useSelector(congressSelectors.balances);
  const spending = useSelector(congressSelectors.spendingSelector);
  const spendingCount = useSelector(congressSelectors.spendingCountSelector);
  const isLoading = useSelector(congressSelectors.isLoading);
  const dispatch = useDispatch();

  const loadMore = (page, pageSize) => {
    const from = spending ? spending.from : 0;
    const skip = (page - 1) * pageSize;
    if (from < (page * pageSize)) {
      dispatch(congressActions.congressSpending.call({ skip, take: pageSize }));
    }
  };

  useEffect(() => {
    dispatch(congressActions.congressSpendingCount.call());
    loadMore(1, 10);
    dispatch(congressActions.getMembers.call());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  return (
    <Flex vertical gap="20px">
      {congressAccountAddress && balances && (
        <WalletCongresSenateWrapper
          userIsMember={userIsMember}
          totalBalance={totalBalance}
          congressAccountAddress={congressAccountAddress}
          liquidMerits={liquidMerits}
          additionalAssets={additionalAssets}
          balances={balances}
          officeType={OfficeType.CONGRESS}
          onSendFunctions={{
            LLD: (data) => congressActions.congressSendLld.call(data),
            LLM: (data) => congressActions.congressSendLlm.call(data),
            LLMPolitipool: (data) => congressActions.congressSendLlmToPolitipool.call(data),
          }}
        />
      )}
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
