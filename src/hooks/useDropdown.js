import {
  useState, useCallback, useRef, useEffect,
} from 'react';

const useDropdown = ({ persist = true } = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdown = useRef(null);
  const dropdownTrigger = useRef(null);

  const setDropdown = (node) => {
    if (node) {
      dropdown.current = node;
    }
  };

  const setDropdownTrigger = (node) => {
    if (node) {
      dropdownTrigger.current = node;
    }
  };

  const closeDropdown = useCallback((e) => {
    if (e) {
      if (dropdownTrigger.current.contains(e.target)) return;
      if (dropdown.current.contains(e.target)) return;
    }

    setIsOpen(false);
    document.body.removeEventListener('click', closeDropdown);
  }, []);

  const handleShowDropdown = (e) => {
    if (!isOpen) {
      setIsOpen(true);
      document.body.addEventListener('click', closeDropdown);
    } else {
      if (persist && dropdown.current.contains(e.target)) return;
      setIsOpen(false);
      document.body.removeEventListener('click', closeDropdown);
    }
  };

  useEffect(() => () => {
    document.body.removeEventListener('click', closeDropdown);
  }, [closeDropdown]);

  return [
    isOpen,
    handleShowDropdown,
    setDropdown,
    setDropdownTrigger,
  ];
};

export default useDropdown;
