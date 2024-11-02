import PropTypes from 'prop-types';
import useTransferLLM from '../hooks/useTransferLLM';
import { useProposalContext } from '../ProposalContext';

function TransferLLMRow({ proposal, id }) {
  const {
    accountId,
    formattedValue,
    identity,
    symbol,
  } = useTransferLLM(proposal);

  const proposals = useProposalContext();

  return proposals.addTabledProposal('transferLLM', id, [
    `${formattedValue} (${symbol}) `,
    `${identity ? `${identity} (${accountId})` : accountId}`,
  ]);
}

TransferLLMRow.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default TransferLLMRow;
