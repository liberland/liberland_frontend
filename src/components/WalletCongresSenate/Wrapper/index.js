import React from 'react';
import Flex from 'antd/es/flex';
import Collapse from 'antd/es/collapse';
import Divider from 'antd/es/divider';
import { BN } from '@polkadot/util';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'usehooks-ts';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import AssetOverview from '../../Wallet/AssetOverview';
import SpendModalWrapper from '../../Modals/SpendModal';
import { valueToBN } from '../../../utils/walletHelpers';
import BalanceOverview from '../../Wallet/BalanceOverview';
import { OfficeType } from '../../../utils/officeTypeEnum';
import ProposeBudgetModalWrapper from '../../Modals/ProposeBudgetModal';

export default function WalletCongresSenateWrapper({
  totalBalance,
  congressAccountAddress,
  liquidMerits,
  additionalAssets,
  onSendFunctions,
  balances,
  officeType,
  userIsMember,
}) {
  const { LLD, LLM, LLMPolitipool } = onSendFunctions;
  const balanceLLD = new BN(balances?.liquidAmount?.amount ?? 0);
  const balanceLLM = valueToBN(balances?.liquidMerits?.amount ?? 0);
  const isBiggerThanDesktop = useMediaQuery('(min-width: 1200px)');

  const walletAddress = (
    <Flex wrap vertical={!isBiggerThanDesktop} gap="7px">
      <strong>
        Wallet address
      </strong>
      <div className="description">
        <CopyIconWithAddress address={congressAccountAddress} />
      </div>
    </Flex>
  );

  if (!congressAccountAddress) {
    return null;
  }

  return (
    <Collapse
      defaultActiveKey={['actions', 'balance', 'assets']}
      collapsible="icon"
      items={[
        userIsMember && {
          label: 'Actions',
          key: 'actions',
          children: (
            <Flex wrap gap="15px">
              {officeType === OfficeType.CONGRESS && userIsMember && (
                <ProposeBudgetModalWrapper />
              )}
              <SpendModalWrapper
                officeType={officeType}
                spendData={{
                  name: 'LLM to politipool',
                  title: 'Spend LLM to politipool',
                  description:
                    'You are going to create LLM spend proposal that will transfer LLM to recipients politipool',
                  subtitle: "Spend LLM to address's politipool",
                }}
                onSend={LLMPolitipool}
                balance={balanceLLM}
                label="Spend LLM (Politipool)"
              />
              <SpendModalWrapper
                officeType={officeType}
                onSend={LLM}
                spendData={{
                  name: 'LLM',
                }}
                balance={balanceLLM}
                label="Spend LLM"
              />
              <SpendModalWrapper
                officeType={officeType}
                onSend={LLD}
                spendData={{
                  name: 'LLD',
                }}
                balance={balanceLLD}
                label="Spend LLD"
              />
              {!isBiggerThanDesktop && (
                <>
                  <Divider />
                  {walletAddress}
                </>
              )}
            </Flex>
          ),
          extra: isBiggerThanDesktop && walletAddress,
        },
        {
          label: 'Balance overview',
          key: 'balance',
          children: (
            <BalanceOverview
              totalBalance={totalBalance}
              balances={balances}
              liquidMerits={liquidMerits}
              showStaked={false}
              isCongress
            />
          ),
        },
        {
          label: 'Assets overview',
          key: 'assets',
          children: (
            <AssetOverview
              additionalAssets={additionalAssets}
              isRemarkNeeded
              officeType={officeType}
              userIsMember={userIsMember}
              isCongress
            />
          ),
        },
      ].filter(Boolean)}
    />
  );
}

WalletCongresSenateWrapper.propTypes = {
  officeType: PropTypes.string.isRequired,
  totalBalance: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]).isRequired,
  congressAccountAddress: PropTypes.string.isRequired,
  liquidMerits: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  additionalAssets: PropTypes.array.isRequired,
  onSendFunctions: PropTypes.shape({
    LLD: PropTypes.func.isRequired,
    LLM: PropTypes.func.isRequired,
    LLMPolitipool: PropTypes.func.isRequired,
  }).isRequired,
  balances: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    liquidAmount: PropTypes.shape({ amount: PropTypes.object.isRequired }),
    liquidMerits: PropTypes.shape({ amount: PropTypes.string.isRequired }),
  }).isRequired,
  userIsMember: PropTypes.bool.isRequired,
};
