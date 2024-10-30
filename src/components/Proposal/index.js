import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { walletActions } from '../../redux/actions';
import { identitySelectors, walletSelectors } from '../../redux/selectors';
import { formatAssets, formatDollars, formatMerits } from '../../utils/walletHelpers';
import { useAddIdToContext } from './hooks/useAddIdToContext';
import useRemark from '../../hooks/useRemark';
/* eslint-disable react/forbid-prop-types */
const ProposalProp = PropTypes.object;

function CouncilSenateExecute({ proposal }) {
  const { args: [calls] } = proposal;
  return (
    <div>
      Execute using
      {' '}
      {proposal.section === 'councilAccount' ? 'Congress' : 'Senate'}
      {' '}
      Wallet:
      <Proposal proposal={calls} />
    </div>
  );
}
CouncilSenateExecute.propTypes = { proposal: ProposalProp.isRequired };

function Schedule({ proposal }) {
  const { args } = proposal;
  return (
    <div>
      Schedule call to be made on
      {' '}
      {args[0].toString()}
      :
      <Proposal proposal={args[3]} />
    </div>
  );
}
Schedule.propTypes = { proposal: ProposalProp.isRequired };

function TransferLLD({ proposal }) {
  const names = useSelector(identitySelectors.selectorIdentityMotions);
  const accountId = proposal.args[0].value.toString();
  const value = proposal.args[1];
  const formattedValue = formatDollars(value);
  const identity = names?.[accountId]?.identity;
  useAddIdToContext(accountId);

  return (
    <div>
      <b>Transfer</b>
      {` ${formattedValue} (LLD) `}
      <b>to</b>
      {` ${identity ? `${identity} (${accountId})` : accountId}`}
    </div>
  );
}
TransferLLD.propTypes = { proposal: ProposalProp.isRequired };

function TransferLLM({ proposal }) {
  const names = useSelector(identitySelectors.selectorIdentityMotions);
  const accountId = proposal.args[0].toString();
  const value = proposal.args[1];
  const formattedValue = formatMerits(value);
  const symbol = proposal.method === 'sendLlm' ? 'LLM' : 'PolitiPooled LLM';
  const identity = names?.[accountId]?.identity;
  useAddIdToContext(accountId);

  return (
    <div>
      <b>Transfer</b>
      {` ${formattedValue} (${symbol}) `}
      <b>to</b>
      {` ${identity ? `${identity} (${accountId})` : accountId}`}
    </div>
  );
}
TransferLLM.propTypes = { proposal: ProposalProp.isRequired };

function TransferAsset({ proposal }) {
  const dispatch = useDispatch();
  const assetId = proposal.args[0];
  const target = proposal.args[1].toString();
  const value = proposal.args[2].toString();
  useAddIdToContext(target);

  const names = useSelector(identitySelectors.selectorIdentityMotions);
  const additionalAssets = useSelector(walletSelectors.selectorAdditionalAssets);
  const [asset] = additionalAssets.filter((item) => item.index === Number(assetId));
  const formattedValue = asset ? formatAssets(value, asset?.metadata?.decimals) : value;
  const identity = names?.[target]?.identity;

  useEffect(() => {
    dispatch(walletActions.getAdditionalAssets.call(true));
  }, [dispatch]);

  return (
    <div>
      <b>Transfer</b>
      {` ${formattedValue} (${asset?.metadata?.symbol || assetId}) `}
      <b>to</b>
      {` ${identity ? `${identity} (${target})` : target}`}
    </div>
  );
}
TransferAsset.propTypes = { proposal: ProposalProp.isRequired };

function RemarkInfo({ proposal }) {
  const remark = useRemark(proposal);

  if (remark.decoded) {
    return (
      <div>
        {remark.decoded}
      </div>
    );
  }

  const {
    amountInUsd,
    category,
    currency,
    description,
    finalDestination,
    formatedDate,
    project,
    supplier,
  } = remark;

  return (
    <>
      <div>
        <b>Category:</b>
        {' '}
        {category}
      </div>
      <div>
        <b>Project:</b>
        {' '}
        {project}
      </div>
      <div>
        <b>Supplier:</b>
        {' '}
        {supplier}
      </div>
      <div>
        <b>Description:</b>
        {' '}
        {description}
      </div>
      <div>
        <b>Currency:</b>
        {' '}
        {currency}
      </div>
      <div>
        <b>Amount in USD:</b>
        {' '}
        {amountInUsd}
      </div>
      <div>
        <b>Final Destination:</b>
        {' '}
        {finalDestination}
      </div>
      <div>
        <b>Date:</b>
        {' '}
        {formatedDate}
      </div>
    </>
  );
}
RemarkInfo.propTypes = { proposal: ProposalProp.isRequired };

export function Proposal({ proposal, isDetailsHidden }) {
  const proposalMethod = proposal.method;
  const proposalSection = proposal.section;
  if (proposalMethod === 'repealLegislation') {
    return <RepealLegislation {...{ proposal }} />;
  } if (proposalMethod === 'repealLegislationSection') {
    return <RepealLegislationSection {...{ proposal }} />;
  } if (proposalMethod === 'amendLegislation') {
    return <AmendLegislation {...{ proposal }} />;
  } if (proposalMethod === 'addLegislation') {
    return <AddLegislation {...{ proposal }} isDetailsHidden={isDetailsHidden} />;
  } if (proposalMethod === 'batchAll') {
    return <BatchAll {...{ proposal }} />;
  } if (proposalMethod === 'externalProposeMajority') {
    return <Referendum {...{ proposal }} />;
  } if (proposalMethod === 'blacklist' && proposalSection === 'democracy') {
    return <Blacklist {...{ proposal }} />;
  } if (proposalMethod === 'execute' && (proposalSection === 'councilAccount' || proposalSection === 'senateAccount')) {
    return <CouncilSenateExecute {...{ proposal }} />;
  } if (proposalMethod === 'schedule' && proposalSection === 'scheduler') {
    return <Schedule {...{ proposal }} />;
  } if (proposalMethod === 'transfer' && proposalSection === 'balances') {
    return <TransferLLD {...{ proposal }} />;
  } if ((proposalMethod === 'sendLlmToPolitipool' || proposalMethod === 'sendLlm') && proposalSection === 'llm') {
    return <TransferLLM {...{ proposal }} />;
  } if (proposalMethod === 'transfer' && proposalSection === 'assets') {
    return <TransferAsset {...{ proposal }} />;
  } if (proposalMethod === 'remark' && proposalSection === 'llm') {
    return <RemarkInfo {...{ proposal }} />;
  }

  return <Raw {...{ proposal }} />;
}

Proposal.defaultProps = {
  isDetailsHidden: false,
  isTableRow: false,
  names: {},
};

Proposal.propTypes = {
  proposal: ProposalProp.isRequired,
  isDetailsHidden: PropTypes.bool,
  isTableRow: PropTypes.bool,
  names: PropTypes.object,
};
