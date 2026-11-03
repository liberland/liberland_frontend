import useTransferAsset from './hooks/useTransferAsset';
import useTransferLLD from './hooks/useTransferLLD';
import useTransferLLM from './hooks/useTransferLLM';
import {
  isAddLegislation,
  isAmendLegislation,
  isBatchAll,
  isBlacklist,
  isCouncilSenateExecute,
  isExternalProposeMajority,
  isFastTrackProposal,
  isRemark,
  isRepealLegislation,
  isRepealLegislationSection,
  isScheduler,
  isTransfer,
  isTransferAssets,
  isTransferLLD,
  isTransferLLM,
} from './predicates';

function getTransferHook(proposal) {
  if (isTransferLLD(proposal)) {
    return useTransferLLD;
  }
  if (isTransferLLM(proposal)) {
    return useTransferLLM;
  }
  return useTransferAsset;
}

export {
  isRepealLegislation,
  isFastTrackProposal,
  isAddLegislation,
  isAmendLegislation,
  isBatchAll,
  isBlacklist,
  isCouncilSenateExecute,
  isExternalProposeMajority,
  isRemark,
  isRepealLegislationSection,
  isScheduler,
  isTransfer,
  isTransferAssets,
  isTransferLLD,
  isTransferLLM,
  getTransferHook,
};
