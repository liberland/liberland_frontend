import React from 'react';
import PropTypes from 'prop-types';
import RepealLegislation from './RepealLegislation';
import RepealLegislationSection from './RepealLegislationSection';
import AmendLegislation from './AmendLegislation';
import AddLegislation from './AddLegislation';
import BatchAll from './BatchAll';
import Referendum from './Referendum';
import Blacklist from './Blacklist';
import CouncilSenateExecute from './CouncilSenateExecute';
import Schedule from './Schedule';
import TransferLLD from './TransferLLD';
import TransferLLM from './TransferLLM';
import TransferAsset from './TransferAsset';
import RemarkInfo from './RemarkInfo';
import Raw from './Raw';
import RemarkRow from './RemarkRow';
import TransferLLMRow from './TransferLLMRow';
import TransferAssetRow from './TransferAssetRow';
import TransferLLDRow from './TransferLLDRow';

export function Proposal({
  proposal,
  isDetailsHidden,
  isTableRow,
  hideTabled,
}) {
  const proposalMethod = proposal.method;
  const proposalSection = proposal.section;
  if (proposalMethod === 'repealLegislation') {
    return <RepealLegislation {...{ proposal }} />;
  }
  if (proposalMethod === 'repealLegislationSection') {
    return <RepealLegislationSection {...{ proposal }} />;
  }
  if (proposalMethod === 'amendLegislation') {
    return <AmendLegislation {...{ proposal }} />;
  }
  if (proposalMethod === 'addLegislation') {
    return <AddLegislation {...{ proposal }} isDetailsHidden={isDetailsHidden} />;
  }
  if (proposalMethod === 'batchAll') {
    return (
      <BatchAll {...{ proposal }}>
        {(prop) => <Proposal proposal={prop} />}
      </BatchAll>
    );
  }
  if (proposalMethod === 'externalProposeMajority') {
    return (
      <Referendum {...{ proposal }}>
        {(prop) => <Proposal proposal={prop} />}
      </Referendum>
    );
  }
  if (proposalMethod === 'blacklist' && proposalSection === 'democracy') {
    return (
      <Blacklist {...{ proposal }}>
        {(prop) => <Proposal proposal={prop} />}
      </Blacklist>
    );
  }
  if (proposalMethod === 'execute' && (proposalSection === 'councilAccount' || proposalSection === 'senateAccount')) {
    return (
      <CouncilSenateExecute {...{ proposal }}>
        {(prop) => <Proposal proposal={prop} />}
      </CouncilSenateExecute>
    );
  }
  if (proposalMethod === 'schedule' && proposalSection === 'scheduler') {
    return (
      <Schedule {...{ proposal }}>
        {(prop) => <Proposal proposal={prop} />}
      </Schedule>
    );
  } if (proposalMethod === 'transfer' && proposalSection === 'balances') {
    if (hideTabled) {
      return null;
    }
    return isTableRow ? <TransferLLDRow {...{ proposal }} /> : <TransferLLD {...{ proposal }} />;
  }
  if ((proposalMethod === 'sendLlmToPolitipool' || proposalMethod === 'sendLlm') && proposalSection === 'llm') {
    if (hideTabled) {
      return null;
    }
    return isTableRow ? <TransferLLMRow {...{ proposal }} /> : <TransferLLM {...{ proposal }} />;
  }
  if (proposalMethod === 'transfer' && proposalSection === 'assets') {
    if (hideTabled) {
      return null;
    }
    return isTableRow ? <TransferAsset {...{ proposal }} /> : <TransferAssetRow {...{ proposal }} />;
  }
  if (proposalMethod === 'remark' && proposalSection === 'llm') {
    if (hideTabled) {
      return null;
    }
    return isTableRow ? <RemarkRow {...{ proposal }} /> : <RemarkInfo {...{ proposal }} />;
  }

  return <Raw {...{ proposal }} />;
}

Proposal.defaultProps = {
  isDetailsHidden: false,
  isTableRow: false,
  hideTabled: false,
  names: {},
};

Proposal.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  isDetailsHidden: PropTypes.bool,
  isTableRow: PropTypes.bool,
  hideTabled: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  names: PropTypes.object,
};
