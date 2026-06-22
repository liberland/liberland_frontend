/* Mechanical splitter for src/api/nodeRpcCall.js -> src/api/nodeRpcCall/.
 * Pure text moves: every top-level definition is sliced verbatim and grouped
 * into a domain module; imports are auto-resolved from token usage. No logic
 * is rewritten. Run from repo root: node scripts/split-noderpc.cjs
 */
const fs = require('fs');
const path = require('path');

const SRC = path.resolve('src/api/nodeRpcCall.js');
const OUTDIR = path.resolve('src/api/nodeRpcCall');
const lines = fs.readFileSync(SRC, 'utf8').split('\n'); // 0-indexed; line N = lines[N-1]

const IMPORT_END = 21;      // last import line
const EXPORT_START = 3147;  // 'export {' line

// External dependency symbols -> their (path-corrected) source module.
// Paths gain one '../' because files move from src/api/ to src/api/nodeRpcCall/.
const NAMED = {
  web3FromAddress: '@polkadot/extension-dapp',
  BN_ZERO: '@polkadot/util',
  hexToU8a: '@polkadot/util',
  u8aToHex: '@polkadot/util',
  ApiPromise: '@polkadot/api',
  WsProvider: '@polkadot/api',
  USER_ROLES: '../../utils/userRolesHelper',
  userRolesHelper: '../../utils/userRolesHelper',
  handleMyDispatchErrors: '../../utils/therapist',
  convertAssetData: '../../utils/dexFormatter',
  parseDollars: '../../utils/walletHelpers',
  parseMerits: '../../utils/walletHelpers',
  blockchainDataToFormObject: '../../utils/nodeRpcCall',
  getMetadataCache: '../../utils/nodeRpcCall',
  setMetadataCache: '../../utils/nodeRpcCall',
  addReturns: '../../utils/staking',
  calcInflation: '../../utils/staking',
  getBaseInfo: '../../utils/staking',
  IndexHelper: '../../utils/council/councilEnum',
  decodeAndFilter: '../../utils/identityParser',
  OfficeType: '../../utils/officeTypeEnum',
  getNetworkRpc: '../../utils/networkHelpers',
};
const DEFAULTS = {
  pako: 'pako',
  groupBy: 'lodash/groupBy',
  identityJudgementEnums: '../../constants/identityJudgementEnums',
};
const NAMESPACES = { centralizedBackend: '../backend' };
const CYCLE = new Set(['convertAssetData']); // needs eslint-disable import/no-cycle

// Domain boundaries by start line.
const RANGES = [
  ['core', 23, 267],
  ['assets', 268, 738],
  ['wallet', 739, 933],
  ['democracy', 934, 1081],
  ['congress', 1082, 1621],
  ['proposals', 1622, 1821],
  ['staking', 1822, 2044],
  ['governance', 2045, 2367],
  ['scheduler', 2368, 2501],
  ['dex', 2502, 2686],
  ['contracts', 2687, 2818],
  ['senate', 2819, 2907],
  ['nfts', 2908, 3146],
];
const fileFor = (line) => RANGES.find(([, a, b]) => line >= a && line <= b)[0];

// Parse top-level definitions: const/function/async function NAME
const defRe = /^(?:const|function|async function)\s+([A-Za-z0-9_$]+)\b/;
const defs = [];
for (let i = IMPORT_END; i < EXPORT_START - 1; i += 1) {
  const m = lines[i] && lines[i].match(defRe);
  if (m) defs.push({ name: m[1], start: i + 1 });
}
// Pull any contiguous comment lines directly above a def into that def (e.g.
// `// eslint-disable-next-line max-len`), so they travel with their target.
// File assignment uses the original def line to avoid boundary misassignment.
const isComment = (l) => /^\s*(\/\/|\*|\/\*)/.test(l);
defs.forEach((d) => {
  d.file = fileFor(d.start);
  let s = d.start;
  while (s - 2 >= IMPORT_END && isComment(lines[s - 2])) s -= 1;
  d.start = s;
});
// Compute end lines (line before next def; last ends before export block).
defs.forEach((d, idx) => {
  d.end = idx + 1 < defs.length ? defs[idx + 1].start - 1 : EXPORT_START - 1;
});

const nameToFile = {};
defs.forEach((d) => { nameToFile[d.name] = d.file; });

// Exported names (from the export block).
const exportNames = [];
for (let i = EXPORT_START; i < lines.length; i += 1) {
  const l = lines[i].trim();
  if (l === '};') break;
  if (l && l !== 'export {') exportNames.push(l.replace(/,$/, ''));
}

// Build each file.
const filesContent = {};
RANGES.forEach(([f]) => { filesContent[f] = []; });
defs.forEach((d) => {
  const body = lines.slice(d.start - 1, d.end).join('\n');
  filesContent[d.file].push(body);
});

const tokenUsed = (body, name) => new RegExp(`\\b${name.replace(/\$/g, '\\$')}\\b`).test(body);

const buildImports = (file, bodyText) => {
  const out = [];
  // External named imports grouped by source.
  const bySource = {};
  Object.entries(NAMED).forEach(([sym, src]) => {
    if (tokenUsed(bodyText, sym)) {
      (bySource[src] = bySource[src] || []).push(sym);
    }
  });
  // Stable ordering: @polkadot first then others, but keep deterministic.
  Object.keys(bySource).sort().forEach((src) => {
    const syms = bySource[src].sort();
    out.push(`import { ${syms.join(', ')} } from '${src}';`);
  });
  Object.entries(DEFAULTS).forEach(([sym, src]) => {
    if (tokenUsed(bodyText, sym)) out.push(`import ${sym} from '${src}';`);
  });
  Object.entries(NAMESPACES).forEach(([sym, src]) => {
    if (tokenUsed(bodyText, sym)) out.push(`import * as ${sym} from '${src}';`);
  });
  // Internal cross-module imports.
  const internalBy = {};
  Object.entries(nameToFile).forEach(([name, srcFile]) => {
    if (srcFile === file) return;
    if (tokenUsed(bodyText, name)) {
      (internalBy[srcFile] = internalBy[srcFile] || []).push(name);
    }
  });
  Object.keys(internalBy).sort().forEach((srcFile) => {
    out.push(`import { ${internalBy[srcFile].sort().join(', ')} } from './${srcFile}';`);
  });
  return out.join('\n');
};

if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR);

// Full concatenated body per file, used to detect cross-module references.
const fileBodyText = {};
RANGES.forEach(([f]) => { fileBodyText[f] = filesContent[f].join('\n\n'); });
// A locally-defined name must be exported if it is public OR referenced by
// any other module.
const usedElsewhere = (name, homeFile) => RANGES
  .some(([f]) => f !== homeFile && tokenUsed(fileBodyText[f], name));

RANGES.forEach(([f]) => {
  const body = filesContent[f].join('\n\n');
  const header = buildImports(f, body);
  // File-level cycle suppression survives eslint import/order auto-fix, which
  // would otherwise detach a line-level disable from its import.
  const usesCycle = [...CYCLE].some((s) => tokenUsed(body, s));
  const prefix = usesCycle ? '/* eslint-disable import/no-cycle */\n' : '';
  const localExports = defs
    .filter((d) => d.file === f && (exportNames.includes(d.name) || usedElsewhere(d.name, f)))
    .map((d) => d.name);
  const exportBlock = localExports.length
    ? `\nexport {\n${localExports.map((n) => `  ${n},`).join('\n')}\n};\n`
    : '';
  fs.writeFileSync(path.join(OUTDIR, `${f}.js`), `${prefix}${header}\n\n${body}\n${exportBlock}`);
});

// Barrel index.js: re-export public names from their files.
const byFile = {};
exportNames.forEach((n) => {
  const f = nameToFile[n];
  if (!f) { console.error('MISSING DEF FOR EXPORT:', n); return; }
  (byFile[f] = byFile[f] || []).push(n);
});
const indexLines = Object.keys(byFile).sort().map((f) => `export {\n${byFile[f].sort().map((n) => `  ${n},`).join('\n')}\n} from './${f}';`);
// index re-exports a module that participates in the dexFormatter cycle.
fs.writeFileSync(path.join(OUTDIR, 'index.js'), `/* eslint-disable import/no-cycle */\n${indexLines.join('\n\n')}\n`);

console.log('defs:', defs.length, 'exports:', exportNames.length);
console.log('per-file def counts:', RANGES.map(([f]) => `${f}:${defs.filter((d) => d.file === f).length}`).join(' '));
