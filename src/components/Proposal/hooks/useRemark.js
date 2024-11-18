import { useState, useEffect } from 'react';
import formatDate from '../../../utils/formatDate';
import { decodeRemark } from '../../../api/nodeRpcCall';

function useRemark(proposal) {
  const [data, setData] = useState(null);
  const bytes = proposal.get('args').data;

  useEffect(() => {
    decodeRemark(bytes).then(({
      currency,
      date,
      amountInUSDAtDateOfPayment,
      category,
      project,
      supplier,
      description,
      finalDestination,
    }) => {
      setData({
        currency,
        date,
        amountInUsd: amountInUSDAtDateOfPayment,
        category,
        project,
        supplier,
        description,
        finalDestination,
      });
    });
  }, [bytes, proposal]);

  if (!data) {
    return {
      project: '',
      description: '',
      category: '',
      supplier: '',
      currency: '',
      date: '',
      finalDestination: '',
      amountInUsd: '',
      formatedDate: '',
    };
  }

  const {
    project,
    description,
    category,
    supplier,
    currency,
    date,
    finalDestination,
    amountInUsd,
  } = data;
  const dateTime = new Date(date.toNumber());
  const formatedDate = formatDate(dateTime, false, false);

  return {
    category: category.toString(),
    project: project.toString(),
    supplier: supplier.toString(),
    description: description.toString(),
    currency: currency.toString(),
    amountInUsd: amountInUsd.toString(),
    finalDestination: finalDestination.toString(),
    formatedDate,
  };
}

export default useRemark;
