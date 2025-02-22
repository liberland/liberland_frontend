export function simplifyCompanyObject(company) {
  const copy = JSON.parse(JSON.stringify(company), (_, value) => {
    if (typeof value === 'object' && value?.value) {
      return value?.value;
    }
    return value;
  });
  return copy;
}
