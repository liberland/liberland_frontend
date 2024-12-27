import PropTypes from 'prop-types';
import useRemark from '../hooks/useRemark';
import { useProposalContext } from '../ProposalContext';

function RemarkRow({ proposal, id }) {
  const remark = useRemark(proposal);
  const { addTabledProposal } = useProposalContext();

  const {
    amountInUsd,
    category,
    currency,
    description,
    finalDestination,
    formattedDate,
    project,
    supplier,
  } = remark;

  return addTabledProposal(id, {
    category,
    project,
    supplier,
    description,
    currency,
    amountInUsd,
    finalDestination,
    formattedDate,
  });
}

RemarkRow.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default RemarkRow;
