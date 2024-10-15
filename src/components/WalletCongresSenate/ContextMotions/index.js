import React, {
  createContext, useState, useContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';

const MotionContext = createContext();

export function MotionProvider({ children }) {
  const [motionIds, setMotionIds] = useState([]);

  const addNewId = (newId) => {
    setMotionIds((prevValue) => [...prevValue, newId]);
  };
  const value = useMemo(() => ({ motionIds, addNewId }), [motionIds]);
  return (
    <MotionContext.Provider value={value}>
      {children}
    </MotionContext.Provider>
  );
}

MotionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useMotionContext = () => useContext(MotionContext);
