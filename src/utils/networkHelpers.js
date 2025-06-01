// Network detection utilities

/**
 * Determines if the current environment is testnet
 * @returns {boolean} true if running on testnet, false if mainnet
 */
export const isTestnet = () => {
  const nodeAddress = process.env.REACT_APP_NODE_ADDRESS;

  // Check if the node address contains testnet indicators
  if (!nodeAddress) return false;

  // Common testnet indicators
  const testnetIndicators = [
    'testnet',
    'test',
    'dev',
    'localhost',
    '127.0.0.1',
    '9944', // Default dev port
    'staging',
  ];

  return testnetIndicators.some((indicator) => nodeAddress.toLowerCase().includes(indicator.toLowerCase()));
};

/**
 * Gets the network name for display purposes
 * @returns {string} 'Testnet' or 'Mainnet'
 */
export const getNetworkName = () => (isTestnet() ? 'Testnet' : 'Mainnet');
