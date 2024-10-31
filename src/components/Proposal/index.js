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
    return (
      <CouncilSenateExecute {...{ proposal }}>
        {(prop) => <Proposal proposal={prop} />}
      </CouncilSenateExecute>
    );
  } if (proposalMethod === 'schedule' && proposalSection === 'scheduler') {
    return (
      <Schedule {...{ proposal }}>
        {(prop) => <Proposal proposal={prop} />}
      </Schedule>
    );
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
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  isDetailsHidden: PropTypes.bool,
  isTableRow: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  names: PropTypes.object,
};
