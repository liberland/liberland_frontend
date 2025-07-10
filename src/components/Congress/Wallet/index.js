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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(congressActions.congressSpending.call());
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
      {spending ? (
        <SpendingTable
          spending={spending.data}
        />
      ) : null}
    </Flex>
  );
}
