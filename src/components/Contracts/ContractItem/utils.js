export const deriveAndHideContractTitle = (paragraphRef, currentValue, setter) => {
  if (!paragraphRef) {
    return;
  }
  const firstTitle = paragraphRef.querySelector('h1,h2,h3');
  if (!firstTitle) {
    return;
  }
  if (currentValue === firstTitle.innerText) {
    return;
  }

  firstTitle.classList.add('hidden');
  if (currentValue === firstTitle.innerText) {
    return;
  }

  setter(firstTitle.innerText);
};
