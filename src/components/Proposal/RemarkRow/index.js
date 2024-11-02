import PropTypes from 'prop-types';
import useRemark from '../hooks/useRemark';
import { useProposalContext } from '../ProposalContext';

function RemarkRow({ proposal, id }) {
  const remark = useRemark(proposal);
  const proposals = useProposalContext();

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

  return proposals.addTabledProposal('remarks', id, [
    category,
    project,
    supplier,
    description,
    currency,
    amountInUsd,
    finalDestination,
    formatedDate,
  ]);
}

RemarkRow.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  proposal: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default RemarkRow;
