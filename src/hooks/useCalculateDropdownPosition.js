import { useEffect } from 'react';

import { calculateDropdownPosition } from '../utils/calculateDropdownPosition';

const useCalculateDropdownPosition = (isOpen, ref) => {
  useEffect(() => {
    window.addEventListener('resize', calculateDropdownPosition);

    return () => {
      window.removeEventListener('resize', calculateDropdownPosition);
    };
  }, []);

  useEffect(() => {
    if (!ref) return;
    calculateDropdownPosition(ref);
  }, [isOpen, ref]);
};

export default useCalculateDropdownPosition;
