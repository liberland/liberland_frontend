/**
 * Tests for the network selection helpers that drive mainnet/testnet switching.
 * These are pure functions over localStorage + env, so we reset both per test.
 */

describe('networkHelpers', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  const load = () => require('../networkHelpers');

  describe('getSelectedNetwork', () => {
    it('honours an explicit mainnet choice in localStorage', () => {
      localStorage.setItem('liberland_network', 'mainnet');
      expect(load().getSelectedNetwork()).toBe('mainnet');
    });

    it('honours an explicit testnet choice in localStorage', () => {
      localStorage.setItem('liberland_network', 'testnet');
      expect(load().getSelectedNetwork()).toBe('testnet');
    });

    it('ignores a corrupt stored value and falls back to detection', () => {
      localStorage.setItem('liberland_network', 'garbage');
      process.env.REACT_APP_NODE_ADDRESS = 'wss://liberland-rpc.n.dwellir.com';
      expect(load().getSelectedNetwork()).toBe('mainnet');
    });

    it('detects testnet from a testchain RPC address', () => {
      process.env.REACT_APP_NODE_ADDRESS = 'wss://testchain.liberland.org';
      expect(load().getSelectedNetwork()).toBe('testnet');
    });

    it('detects testnet from a localhost RPC address', () => {
      process.env.REACT_APP_NODE_ADDRESS = 'ws://localhost:9944';
      expect(load().getSelectedNetwork()).toBe('testnet');
    });

    it('defaults to mainnet for a production RPC address', () => {
      process.env.REACT_APP_NODE_ADDRESS = 'wss://liberland-rpc.n.dwellir.com';
      expect(load().getSelectedNetwork()).toBe('mainnet');
    });
  });

  describe('getNetworkConfig', () => {
    it('returns the mainnet config with hard-coded endpoints', () => {
      localStorage.setItem('liberland_network', 'mainnet');
      const cfg = load().getNetworkConfig();
      expect(cfg.key).toBe('mainnet');
      expect(cfg.rpc).toBe('wss://liberland-rpc.n.dwellir.com');
      expect(cfg.api).toBe('https://api.liberland.org');
    });

    it('returns the testnet config sourced from env', () => {
      localStorage.setItem('liberland_network', 'testnet');
      process.env.REACT_APP_API = 'https://staging.api.liberland.org';
      const cfg = load().getNetworkConfig();
      expect(cfg.key).toBe('testnet');
      expect(cfg.api).toBe('https://staging.api.liberland.org');
    });
  });

  describe('setSelectedNetwork', () => {
    it('persists the choice and reloads the page', () => {
      const reload = jest.fn();
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: { ...window.location, reload },
      });
      load().setSelectedNetwork('testnet');
      expect(localStorage.getItem('liberland_network')).toBe('testnet');
      expect(reload).toHaveBeenCalledTimes(1);
    });
  });

  describe('isTestnet', () => {
    it('is true when testnet is selected', () => {
      localStorage.setItem('liberland_network', 'testnet');
      expect(load().isTestnet()).toBe(true);
    });

    it('is false when mainnet is selected', () => {
      localStorage.setItem('liberland_network', 'mainnet');
      expect(load().isTestnet()).toBe(false);
    });
  });
});
