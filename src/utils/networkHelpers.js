export const NETWORKS = {
  mainnet: {
    key: 'mainnet',
    label: 'Mainnet',
    rpc: 'wss://liberland-rpc.n.dwellir.com',
    api: 'https://api.liberland.org',
    middlewareApi: 'https://api.blockchain.liberland.org',
    explorer: 'https://archive.mainnet.liberland.org',
    ssoApi: 'https://sso.liberland.org',
    ssoClientId: '137685',
    ssoAdminClientId: '162334',
    ssoAdminLink: 'https://blockchain.liberland.org/?admin=true',
    frontendRedirect: 'https://blockchain.liberland.org/',
    faucetAddress: '5CMHBiso4hX5cDFViz7bqxd5FZPLwvRa1ZzQ52vBZCeTYLru',
  },
  testnet: {
    key: 'testnet',
    label: 'Testnet',
    // Hard-coded from .env.dist so the switcher works regardless of which
    // server built the bundle (the mainnet box's .env holds mainnet values).
    // explorer has no /graphql suffix — explorer.js appends it via .post().
    rpc: 'wss://testchain.liberland.org',
    api: 'https://staging.api.liberland.org',
    middlewareApi: 'https://staging.api.blockchain.liberland.org',
    explorer: 'https://archive.testchain.liberland.org',
    ssoApi: 'https://staging.sso.liberland.org',
    ssoClientId: '1103',
    ssoAdminClientId: '1103',
    ssoAdminLink: 'https://testnet.liberland.org/?admin=true',
    frontendRedirect: 'https://testnet.liberland.org',
    faucetAddress: '5CSxW2nn4mQckisBziai4wGqQLEdKTUA4Xnt8iy8jtj5q52Q',
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
