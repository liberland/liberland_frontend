const MAINNET_RPC = 'wss://liberland-rpc.dwellir.com';
const TESTNET_RPC = process.env.REACT_APP_NODE_ADDRESS;

export const NETWORKS = {
  mainnet: { key: 'mainnet', label: 'Mainnet', rpc: MAINNET_RPC },
  testnet: { key: 'testnet', label: 'Testnet', rpc: TESTNET_RPC },
};

const detectDefaultNetwork = () => {
  const addr = process.env.REACT_APP_NODE_ADDRESS || '';
  const testnetIndicators = ['testnet', 'testchain', 'test', 'dev', 'localhost', '127.0.0.1', '9944', 'staging'];
  return testnetIndicators.some((i) => addr.toLowerCase().includes(i)) ? 'testnet' : 'mainnet';
};

export const getSelectedNetwork = () => {
  try {
    const saved = localStorage.getItem('liberland_network');
    if (saved === 'mainnet' || saved === 'testnet') return saved;
  } catch (_) { /* localStorage unavailable (SSR/test) */ }
  return detectDefaultNetwork();
};

export const setSelectedNetwork = (network) => {
  localStorage.setItem('liberland_network', network);
  window.location.reload();
};

export const getNetworkRpc = () => NETWORKS[getSelectedNetwork()].rpc;

export const getNetworkName = () => NETWORKS[getSelectedNetwork()].label;

// Legacy helpers kept for compatibility
export const isTestnet = () => getSelectedNetwork() === 'testnet';
