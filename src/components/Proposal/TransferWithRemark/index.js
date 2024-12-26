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
    formattedDate,
    project,
    supplier,
  } = useRemark(remark);
  const { addTabledProposal } = useProposalContext();

  return addTabledProposal(id, {
    amountInUsd,
    category,
    project,
    supplier,
    description,
    currency,
    finalDestination,
    formattedDate,
    ...formattedRow,
  });
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
