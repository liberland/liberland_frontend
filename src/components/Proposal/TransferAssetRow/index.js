import PropTypes from 'prop-types';
import useTransferAsset from '../hooks/useTransferAsset';
import { useProposalContext } from '../ProposalContext';

function TransferAssetRow({ proposal, id }) {
  const {
    formattedRow,
  } = useTransferAsset(proposal);

  const { addTabledProposal } = useProposalContext();

  return addTabledProposal(id, formattedRow);
}

TransferAssetRow.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default TransferAssetRow;
