import React from 'react';
import Flex from 'antd/es/flex';
import Collapse from 'antd/es/collapse';
import { BN } from '@polkadot/util';
import PropTypes from 'prop-types';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload.svg';
import { ReactComponent as GraphIcon } from '../../../assets/icons/graph.svg';
import AssetOverview from '../../Wallet/AssetOverview';
import SpendModalWrapper from '../../Modals/SpendModal';
import { valueToBN } from '../../../utils/walletHelpers';
import BalanceOverview from '../../Wallet/BalanceOverview';
import { OfficeType } from '../../../utils/officeTypeEnum';
import ProposeBudgetModalWrapper from '../../Modals/ProposeBudgetModal';

export default function WalletCongresSenateWrapper({
  totalBalance,
  congresAccountAddress,
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

  if (!congresAccountAddress) {
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
                icon={<GraphIcon />}
              />
              <SpendModalWrapper
                officeType={officeType}
                onSend={LLM}
                spendData={{
                  name: 'LLM',
                }}
                balance={balanceLLM}
                label="Spend LLM"
                icon={<GraphIcon />}
              />
              <SpendModalWrapper
                officeType={officeType}
                onSend={LLD}
                spendData={{
                  name: 'LLD',
                }}
                balance={balanceLLD}
                label="Spend LLD"
                icon={<UploadIcon />}
              />
            </Flex>
          ),
          extra: (
            <Flex wrap gap="15px">
              <span>
                Wallet address
              </span>
              <CopyIconWithAddress address={congresAccountAddress} />
            </Flex>
          ),
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
  congresAccountAddress: PropTypes.string.isRequired,
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
