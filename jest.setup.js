require('@testing-library/jest-dom');

// jsdom does not provide TextEncoder/TextDecoder, but @polkadot/util-crypto
// (pulled in transitively by most components) needs them at import time.
const { TextEncoder, TextDecoder } = require('util');

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
