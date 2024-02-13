export const calculateDropdownPosition = (dropdownRef) => {
  const dropdownNode = dropdownRef.current;

  if (!dropdownNode) return;

  const dropdownRect = dropdownNode.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (dropdownRect.bottom > windowHeight) {
    // If the dropdown is near the bottom of the screen, adjust positioning
    dropdownNode.style.top = `-${dropdownRect.height + 10}px`;
  } else {
    // Reset positioning
    dropdownNode.style.top = '110%';
  }
};
