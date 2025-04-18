const placeholder = {
  timestamp: '-',
  recipient: '-',
  asset: '-',
  value: '-',
  category: '-',
  project: '-',
  supplier: '-',
  description: '-',
  finalDestination: '-',
  amountInUsd: '-',
};

export const spendingTableMerge = ({ data, from }, previous) => {
  const next = [...previous?.data || []];
  if (next.length < from) {
    next.push(...new Array(from - next.length).fill(placeholder));
    next.push(...data);
    return next;
  }
  next.push(...data);
  return {
    data: next,
    from: Math.max(previous?.from || 0, from),
  };
};
