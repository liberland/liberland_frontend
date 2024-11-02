import React from 'react';
import PropTypes from 'prop-types';
import useRemark from '../hooks/useRemark';

function RemarkInfo({ proposal }) {
  const remark = useRemark(proposal);

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
      <div>
        <b>Category:</b>
        {' '}
        {category}
      </div>
      <div>
        <b>Project:</b>
        {' '}
        {project}
      </div>
      <div>
        <b>Supplier:</b>
        {' '}
        {supplier}
      </div>
      <div>
        <b>Description:</b>
        {' '}
        {description}
      </div>
      <div>
        <b>Currency:</b>
        {' '}
        {currency}
      </div>
      <div>
        <b>Amount in USD:</b>
        {' '}
        {amountInUsd}
      </div>
      <div>
        <b>Final Destination:</b>
        {' '}
        {finalDestination}
      </div>
      <div>
        <b>Date:</b>
        {' '}
        {formatedDate}
      </div>
    </>
  );
}

// eslint-disable-next-line react/forbid-prop-types
RemarkInfo.propTypes = { proposal: PropTypes.object.isRequired };

export default RemarkInfo;
