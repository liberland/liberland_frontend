/*
 * Design language selection.
 *
 * Two skins over one unchanged application. Choosing a language swaps the
 * design tokens (the CSS custom properties in _variables.scss and the antd
 * theme in AntdProvider), the chrome around the page (Layout renders the State
 * shell in place of the Ledger sider and header), the coat of arms and the tab
 * icon. No route, no data and no behaviour differs between them, which is what
 * makes the switch safe to ship.
 *
 * The choice is stored per browser and survives reloads and sessions until the
 * citizen changes it.
 */

export const DESIGNS = {
  ledger: {
    key: 'ledger',
    label: 'Liberland Limited Ledger',
    description: 'Warm parchment, Spectral serif, soft edges. The current look.',
  },
  state: {
    key: 'state',
    label: 'Liberland State',
    description: 'Near-black and state yellow, Playfair Display, squared edges and hairline rules.',
  },
};

const STORAGE_KEY = 'liberland_design';
const DEFAULT_DESIGN = DESIGNS.ledger.key;

export const getSelectedDesign = () => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && DESIGNS[saved]) return saved;
  } catch (_) { /* localStorage unavailable (private mode, SSR, tests) */ }
  return DEFAULT_DESIGN;
};

export const persistDesign = (design) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, DESIGNS[design] ? design : DEFAULT_DESIGN);
  } catch (_) { /* a failed write must never break the switch */ }
};

/*
 * Tab icons. The Ledger's is the blue roundel the app has always shipped; the
 * State language uses its own escutcheon. Both live at fixed paths under the
 * site root — a relative href resolves against the current route, so it 404s
 * on every screen below the first level.
 */
export const FAVICONS = {
  ledger: { href: '/favicon.ico', type: 'image/x-icon' },
  state: { href: '/state-escutcheon.png', type: 'image/png' },
};

const applyFavicon = (design) => {
  const icon = FAVICONS[design] || FAVICONS[DEFAULT_DESIGN];
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  if (link.getAttribute('href') !== icon.href) {
    link.setAttribute('type', icon.type);
    link.setAttribute('href', icon.href);
  }
};

/**
 * The stylesheet keys every token off this attribute. Ledger is the default
 * and carries no attribute, so an unset or unknown value renders exactly as
 * the app did before this feature existed. The tab icon follows the same
 * choice, so the arms in the browser tab match the arms on the page.
 */
export const applyDesignAttribute = (design) => {
  const html = document.documentElement;
  if (design === DESIGNS.state.key) {
    html.setAttribute('data-design', DESIGNS.state.key);
  } else {
    html.removeAttribute('data-design');
  }
  applyFavicon(design);
};

export const getDesignLabel = (design) => (DESIGNS[design] || DESIGNS[DEFAULT_DESIGN]).label;

/*
 * Light/dark is persisted too. It used to be re-derived from
 * prefers-color-scheme on every load, so a chosen canvas — including the dark
 * one a design language opens on — was lost at the next navigation. An unset
 * value still falls back to the system preference.
 */
const THEME_KEY = 'liberland_theme';

export const getStoredTheme = () => {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch (_) { /* unavailable */ }
  return null;
};

export const persistTheme = (isDark) => {
  try {
    window.localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  } catch (_) { /* a failed write must never break the toggle */ }
};

/** The canvas each language opens on when it is selected. */
export const nativeThemeIsDark = (design) => design === DESIGNS.state.key;
