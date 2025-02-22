import PropTypes from 'prop-types';
import React, { createContext } from 'react';

const context = createContext({ isStock: false });

export const useStockContext = () => React.useContext(context);

export function StockContextProvider({ isStock, children }) {
  const { Provider } = context;
  return (
    <Provider value={{ isStock }}>
      {children}
    </Provider>
  );
}

export const stockWrapper = (Component, isStock) => function wrap() {
  return (
    <StockContextProvider isStock={isStock}>
      <Component />
    </StockContextProvider>
  );
};

StockContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  isStock: PropTypes.bool,
};
