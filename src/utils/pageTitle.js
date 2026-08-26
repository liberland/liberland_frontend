/* eslint-disable max-len */
import router from '../router';

// Human-readable name + subtitle for each top-level route. Drives both the
// visible page heading and document.title, so the browser tab (and anything
// reading it programmatically) reflects the current route instead of a single
// constant title for the whole SPA.
export const PAGE_TITLES = [
  { test: (p) => p === router.home.feed || p === router.home.index, title: 'Dashboard', sub: 'Welcome back to the Republic' },
  { test: (p) => p.startsWith(router.home.wallet), title: 'Wallet', sub: 'Your assets, staking & transfers' },
  { test: (p) => p.startsWith(router.home.documents), title: 'Identity & Documents', sub: 'Your citizenship, records & court standing' },
  { test: (p) => p.startsWith(router.voting.referendum), title: 'Voting', sub: 'Referenda, proposals & the assembly' },
  { test: (p) => p.startsWith(router.voting.congressionalAssemble), title: 'Congress Assembly', sub: 'Congressional votes & governance' },
  { test: (p) => p.startsWith(router.home.legislation), title: 'Legislation', sub: 'The Constitution and the law of the land' },
  { test: (p) => p.startsWith(router.home.congress), title: 'Congress', sub: 'Motions, members & the congressional treasury' },
  { test: (p) => p.startsWith(router.home.senate), title: 'Senate', sub: 'Veto motions & scheduled spending' },
  { test: (p) => p.startsWith(router.home.staking), title: 'Staking', sub: 'Secure the chain, earn rewards' },
  { test: (p) => p.startsWith(router.home.registries), title: 'Registries', sub: 'Companies, land & on-chain assets' },
  { test: (p) => p.startsWith(router.contracts.overview) || p.startsWith(router.home.contracts), title: 'Contracts', sub: 'Agreements signed on-chain' },
  { test: (p) => p.startsWith(router.home.offices), title: 'Offices', sub: 'Government offices & state services' },
  { test: (p) => p.startsWith(router.home.companies), title: 'Companies', sub: 'Business registry of Liberland' },
  { test: (p) => p.startsWith(router.nfts.overview) || p.startsWith(router.home.nfts), title: 'NFTs', sub: 'Digital assets & collectibles' },
  { test: (p) => p.startsWith(router.home.profile), title: 'Profile', sub: 'Your account & settings' },
];

export function getPageTitle(pathname) {
  const match = PAGE_TITLES.find((entry) => entry.test(pathname));
  return match ? [match.title, match.sub] : ['Liberland', 'Republic Ledger'];
}

export function getDocumentTitle(pathname) {
  const [title] = getPageTitle(pathname);
  return title === 'Liberland' ? 'Liberland Republic Ledger' : `${title} · Liberland`;
}
