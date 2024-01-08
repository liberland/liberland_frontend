const dateComponentPad = (newValue) => {
  const format = String(newValue);

  return format.length < 2 ? `0${format}` : format;
};

const formatDate = (date, isSeparator = false) => {
  const datePart = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(dateComponentPad);
  const timePart = [date.getHours(), date.getMinutes()].map(dateComponentPad);

  return `${datePart.join('-')}${isSeparator && ' at'} ${timePart.join(':')}`;
};

export default formatDate;
