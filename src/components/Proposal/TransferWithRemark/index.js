import PropTypes from 'prop-types';
import useRemark from '../hooks/useRemark';
import { useProposalContext } from '../ProposalContext';

function TransferWithRemark({
  transfer,
  remark,
  useTransfer,
  id,
}) {
  const { formattedRow } = useTransfer(transfer);
  const {
    amountInUsd,
    category,
    currency,
    description,
    finalDestination,
    formatedDate,
    project,
    supplier,
  } = useRemark(remark);
  const proposals = useProposalContext();

  return proposals.addTabledProposal('remarkedTransfer', id, [
    formattedRow[0],
    amountInUsd,
    category,
    project,
    supplier,
    description,
    currency,
    finalDestination,
    formatedDate,
    formattedRow[1],
  ]);
}

TransferWithRemark.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  transfer: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  remark: PropTypes.object.isRequired,
  useTransfer: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default TransferWithRemark;
