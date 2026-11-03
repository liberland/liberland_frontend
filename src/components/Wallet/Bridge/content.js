/*
 * The bridge instructions, as one source for both design languages.
 *
 * Condensed from Liberland's own documentation — "How to Bridge to Ethereum"
 * and "How to Bridge to Solana" — so the two skins cannot drift apart on what
 * the steps actually are. Nothing here is invented: the figures, the order of
 * the hops and the warnings are the docs'.
 */

export const HASHI_BRIDGE = 'https://polkaswap.io/#/bridge/';
export const LLD_XOR_SWAP = 'https://polkaswap.io/#/swap/LLD/XOR';
export const BRIDGE_DOCS = 'https://docs.liberland.org/blockchain/cross-chain-bridge';
export const SOLANA_DOCS = 'https://docs.liberland.org/blockchain/how-to-bridge-ethereum-solana';

export const INTRO = 'The Liberland blockchain is connected to other chains by the HASHI bridge, '
  + 'run by Polkaswap on the SORA network. It carries LLD and LLM out to SORA, Ethereum, Polkadot '
  + 'and Kusama, and brings assets such as ETH, wBTC, USDT, XOR and DOT back in.';

export const TWO_HOPS = 'Reaching Ethereum is two hops: Liberland to SORA, then SORA to Ethereum. '
  + 'That is deliberate — you hold your own tokens at every step rather than handing them to a '
  + 'single custodian for the whole journey.';

export const PREREQUISITES = [
  'A wallet that can talk to dApps — a browser extension such as Polkadot.js, SubWallet or '
  + 'Talisman on desktop, or SubWallet on mobile.',
  'LLD in that wallet, both to bridge and to pay the Liberland fee.',
  'For the Ethereum hop: XOR on SORA for the network fee, and an Ethereum wallet with ETH for gas.',
];

export const STEPS = [
  {
    title: 'Liberland to SORA',
    body: [
      'Open the HASHI bridge and connect the Substrate account you use on both Liberland and SORA.',
      'Select the Liberland network, pick the token and the direction, enter an amount and press Bridge.',
      'Your wallet asks you to sign. The transfer takes a couple of minutes.',
    ],
    note: 'Minimum 1 LLD. The Liberland fee is about 0.01 LLD; SORA charges nothing on this hop.',
  },
  {
    title: 'Get XOR for the next hop',
    body: [
      'The SORA side of the bridge is paid for in XOR, so swap a little LLD for it first.',
      'Around 5 USD of XOR is enough — 2 to 5 LLD covers it comfortably.',
    ],
    note: 'You can also arrive at XOR from ETH, DOT or KSM; the bridge does not force you to hold '
      + 'the native coin first.',
  },
  {
    title: 'SORA to Ethereum',
    body: [
      'Back on the bridge, select the Ethereum network and the token, and connect both your '
      + 'Substrate and Ethereum wallets. SubWallet can hold both.',
      'Enter the amount and bridge. You then confirm a second transaction on Ethereum to receive '
      + 'the tokens.',
      'When it completes, accept the prompt to add LLD to your wallet so the balance shows up.',
    ],
    note: 'Keep at least 50 USD of ETH for gas if you also intend to open a position on a '
      + 'decentralised exchange afterwards.',
  },
  {
    title: 'Coming back',
    body: [
      'The bridge runs both ways: Ethereum to SORA, then SORA to Liberland.',
      'Moving out of Ethereum asks you to approve a spending cap for LLD first — that is the '
      + 'bridge contract being allowed to move your tokens, and it is a normal prerequisite.',
    ],
    note: 'The Ethereum leg waits about 30 blocks — roughly eight minutes — before it settles.',
  },
];

export const WARNINGS = [
  'Use only the officially announced bridge interface linked on this page.',
  'Do not trust third-party or unofficial services offering to bridge for you.',
  'Edge Wallet cannot be used: it does not connect to dApps.',
];

export const SOLANA_NOTE = 'Solana is reached from Ethereum with deBridge rather than HASHI; '
  + 'Liberland documents that route separately.';
