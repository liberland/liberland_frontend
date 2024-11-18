import PropTypes from 'prop-types';
import useTransferLLM from '../hooks/useTransferLLM';
import { useProposalContext } from '../ProposalContext';

function TransferLLMRow({ proposal, id }) {
  const {
    formattedRow,
  } = useTransferLLM(proposal);

  const { addTabledProposal } = useProposalContext();

  return addTabledProposal('transferLLM', id, formattedRow);
}

TransferLLMRow.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default TransferLLMRow;
