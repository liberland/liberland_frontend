import React from 'react';
import formatDate from '../utils/formatDate';
import { decodeRemark } from '../api/nodeRpcCall';

function useRemark(proposal) {
  const [data, setData] = React.useState(null);
  const bytes = proposal.get('args').data;

  React.useEffect(() => {
    decodeRemark(bytes).then((item) => {
      setData({
        currency: item.currency,
        date: item.date,
        amountInUsd: item.amountInUSDAtDateOfPayment,
        category: item.category,
        project: item.project,
        supplier: item.supplier,
        description: item.description,
        finalDestination: item.finalDestination,
      });
    });
  }, [bytes, proposal]);

  if (!data) {
    return { decoded: new TextDecoder('utf-8').decode(bytes) };
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
    category,
    project,
    supplier,
    description,
    currency,
    amountInUsd: amountInUsd.toString(),
    finalDestination,
    formatedDate,
  };
}

export default useRemark;
