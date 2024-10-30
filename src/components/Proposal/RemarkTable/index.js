import React from 'react';
import PropTypes from 'prop-types';
import useRemark from '../../../hooks/useRemark';

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

function RemarkTable({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th>
            Category
          </th>
          <th>
            Project
          </th>
          <th>
            Supplier
          </th>
          <th>
            Description
          </th>
          <th>
            Currency
          </th>
          <th>
            Amount in USD
          </th>
          <th>
            Final Destination
          </th>
          <th>
            Date
          </th>
          <th>
            Controls
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ proposal, extra }) => (
          <RemarkRow key={proposal} proposal={proposal} extra={extra} />
        ))}
      </tbody>
    </table>
  );
}

RemarkTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    proposal: PropTypes.shape({}).isRequired,
    extra: PropTypes.node,
  }).isRequired).isRequired,
};

export default RemarkTable;
