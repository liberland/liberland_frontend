export function simplifyCompanyObject(company) {
  const copy = JSON.parse(JSON.stringify(company), (_, value) => {
    if (typeof value === 'object' && typeof value?.value !== 'undefined') {
      return value?.value;
    }
    return value;
  });
  return copy;
}
