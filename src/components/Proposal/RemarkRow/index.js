import React from 'react';
import PropTypes from 'prop-types';
import useRemark from '../hooks/useRemark';

function RemarkRow({ proposal, extra }) {
  const remark = useRemark(proposal);

  if (remark.decoded) {
    return (
      <tr>
        <td colSpan={8}>
          {remark.decoded}
        </td>
        {extra && (
          <td>
            {extra}
          </td>
        )}
      </tr>
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
    <tr>
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
    </tr>
  );
}

RemarkRow.propTypes = {
  proposal: PropTypes.shape({}).isRequired,
  extra: PropTypes.node,
};

export default RemarkRow;
