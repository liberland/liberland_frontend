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
import {
  isAddLegislation,
  isAmendLegislation,
  isBatchAll,
  isBlacklist,
  isCouncilSenateExecute,
  isExternalProposeMajority,
  isRemark,
  isRepealLegislation,
  isRepealLegislationSection,
  isScheduler,
  isTransferAssets,
  isTransferLLD,
  isTransferLLM,
} from './utils';

export function Proposal({
  proposal,
  isDetailsHidden,
  isTableRow,
}) {
  if (isRepealLegislation(proposal)) {
    return <RepealLegislation {...{ proposal }} />;
  }
  if (isRepealLegislationSection(proposal)) {
    return <RepealLegislationSection {...{ proposal }} />;
  }
  if (isAmendLegislation(proposal)) {
    return <AmendLegislation {...{ proposal }} />;
  }
  if (isAddLegislation(proposal)) {
    return <AddLegislation {...{ proposal }} isDetailsHidden={isDetailsHidden} />;
  }
  if (isBatchAll(proposal)) {
    return (
      <BatchAll
        {...{ proposal }}
        isTableRow={isTableRow}
        batchId={proposal.toJSON().callIndex}
        id={proposal.toString()}
      >
        {(prop) => <Proposal proposal={prop} isTableRow={isTableRow} />}
      </BatchAll>
    );
  }
  if (isExternalProposeMajority(proposal)) {
    return (
      <Referendum {...{ proposal }}>
        {(prop) => <Proposal proposal={prop} isTableRow={isTableRow} />}
      </Referendum>
    );
  }
  if (isBlacklist(proposal)) {
    return (
      <Blacklist {...{ proposal }}>
        {(prop) => <Proposal proposal={prop} isTableRow={isTableRow} />}
      </Blacklist>
    );
  }
  if (isCouncilSenateExecute(proposal)) {
    return (
      <CouncilSenateExecute {...{ proposal }}>
        {(prop) => <Proposal proposal={prop} isTableRow={isTableRow} />}
      </CouncilSenateExecute>
    );
  }
  if (isScheduler(proposal)) {
    return (
      <Schedule {...{ proposal }}>
        {(prop) => <Proposal proposal={prop} isTableRow={isTableRow} />}
      </Schedule>
    );
  }
  if (isTransferLLD(proposal)) {
    return isTableRow
      ? <TransferLLDRow id={proposal.toString()} {...{ proposal }} />
      : <TransferLLD {...{ proposal }} />;
  }
  if (isTransferLLM(proposal)) {
    return isTableRow
      ? <TransferLLMRow id={proposal.toString()} {...{ proposal }} />
      : <TransferLLM {...{ proposal }} />;
  }
  if (isTransferAssets(proposal)) {
    return isTableRow
      ? <TransferAssetRow id={proposal.toString()} {...{ proposal }} />
      : <TransferAsset {...{ proposal }} />;
  }
  if (isRemark(proposal)) {
    return isTableRow
      ? <RemarkRow id={proposal.toString()} {...{ proposal }} />
      : <RemarkInfo {...{ proposal }} />;
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
