import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'antd/es/flex';
import { congressActions } from '../../../redux/actions';
import { congressSelectors } from '../../../redux/selectors';
import WalletCongresSenateWrapper from '../../WalletCongresSenate/Wrapper';
import { OfficeType } from '../../../utils/officeTypeEnum';
import SpendingTable from '../../SpendingTable';
import { paginator } from '../../../utils/pagination';

const pageSize = 10;

export default function Wallet() {
  const totalBalance = useSelector(congressSelectors.totalBalance);
  const liquidMerits = useSelector(congressSelectors.liquidMeritsBalance);
  const congressAccountAddress = useSelector(congressSelectors.walletAddress);
  const additionalAssets = useSelector(congressSelectors.additionalAssets);
  const userIsMember = useSelector(congressSelectors.userIsMember);
  const balances = useSelector(congressSelectors.balances);
  const spending = useSelector(congressSelectors.spendingSelector);
  const spendingCount = useSelector(congressSelectors.spendingCountSelector);
  const dispatch = useDispatch();
  const [skip, setSkip] = useState(0);

  const loadMore = useCallback(() => {
    dispatch(congressActions.congressSpending.call({ skip, take: pageSize }));
    setSkip((prev) => prev + pageSize);
  }, [dispatch, skip]);

  useEffect(() => {
    dispatch(congressActions.congressSpendingCount.call());
    loadMore();
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
          spending={spending}
          onNext={paginator({
            action: loadMore,
            count: spendingCount,
            loaded: spending.length,
            pageSize,
          })}
        />
      ) : null}
    </Flex>
  );
}
