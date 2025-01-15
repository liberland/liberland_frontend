import React, {
  useEffect,
  useContext,
  useState,
  createContext,
} from 'react';
import PropTypes from 'prop-types';

const HideTitleContext = createContext();

export const useHideTitle = () => {
  // eslint-disable-next-line no-unused-vars
  const [_, setHidden] = useContext(HideTitleContext);
  useEffect(() => {
    setHidden(true);
    return () => setHidden(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useHasHiddenTitle = () => {
  const [hidden] = useContext(HideTitleContext);
  return hidden;
};

export function HideTitleProvider({ children }) {
  const state = useState(false);
  return (
    <HideTitleContext.Provider value={state}>
      {children}
    </HideTitleContext.Provider>
  );
}

HideTitleProvider.propTypes = {
  children: PropTypes.node,
};
