import React from 'react';
import PropTypes from 'prop-types';
import useRemark from '../hooks/useRemark';

function RemarkRow({ proposal, extra }) {
  const remark = useRemark(proposal);

  if (remark.decoded) {
    return (
      <>
        <td colSpan={8}>
          {remark.decoded}
        </td>
        {extra && (
          <td>
            {extra}
          </td>
        )}
      </>
    );
  }

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

  return (
    <>
      <td>
        {category}
      </td>
      <td>
        {project}
      </td>
      <td>
        {supplier}
      </td>
      <td>
        {description}
      </td>
      <td>
        {currency}
      </td>
      <td>
        {amountInUsd}
      </td>
      <td>
        {finalDestination}
      </td>
      <td>
        {formatedDate}
      </td>
      <td>
        {extra}
      </td>
    </>
  );
}

RemarkRow.propTypes = {
  proposal: PropTypes.shape({}).isRequired,
  extra: PropTypes.node,
};

export default RemarkRow;
