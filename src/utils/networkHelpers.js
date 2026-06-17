export const NETWORKS = {
  mainnet: {
    key: 'mainnet',
    label: 'Mainnet',
    rpc: 'wss://liberland-rpc.dwellir.com',
    api: 'https://api.liberland.org',
    middlewareApi: 'https://api.blockchain.liberland.org',
    explorer: 'https://archive.mainnet.liberland.org/graphql',
    ssoApi: 'https://sso.liberland.org',
  },
  testnet: {
    key: 'testnet',
    label: 'Testnet',
    rpc: process.env.REACT_APP_NODE_ADDRESS,
    api: process.env.REACT_APP_API,
    middlewareApi: process.env.REACT_APP_MIDDLEWARE_API,
    explorer: process.env.REACT_APP_EXPLORER,
    ssoApi: process.env.REACT_APP_SSO_API,
  },
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

export const getNetworkConfig = () => NETWORKS[getSelectedNetwork()];

export const getNetworkRpc = () => getNetworkConfig().rpc;

export const getNetworkName = () => getNetworkConfig().label;

// Legacy helper kept for compatibility
export const isTestnet = () => getSelectedNetwork() === 'testnet';
