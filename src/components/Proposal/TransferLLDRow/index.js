import PropTypes from 'prop-types';
import useTransferLLD from '../hooks/useTransferLLD';
import { useProposalContext } from '../ProposalContext';

function TransferLLD({ proposal, id }) {
  const {
    formattedRow,
  } = useTransferLLD(proposal);

  const proposals = useProposalContext();

  return proposals.addTabledProposal('transferLLD', id, formattedRow);
}

TransferLLD.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default TransferLLD;
