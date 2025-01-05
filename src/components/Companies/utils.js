export function getCompanyDetail(mainDataObject, nameFind, slice) {
  const fromMainData = mainDataObject?.staticFields?.find(
    ({ name }) => name === nameFind,
  )?.display;
  const fromDynamicData = mainDataObject?.dynamicFields?.find(
    ({ name }) => name === nameFind,
  )?.data?.map((data) => data?.display).slice(...slice).filter(Boolean).join(', ');
  return fromMainData || fromDynamicData || '';
}
