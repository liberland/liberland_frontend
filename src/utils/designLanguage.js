/*
 * Design language selection.
 *
 * Two skins over one unchanged application. Choosing a language only swaps
 * design tokens — the CSS custom properties in _variables.scss and the antd
 * theme in AntdProvider. No route, component, layout or behaviour differs
 * between them, which is what makes the switch safe to ship.
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

/**
 * The stylesheet keys every token off this attribute. Ledger is the default
 * and carries no attribute, so an unset or unknown value renders exactly as
 * the app did before this feature existed.
 */
export const applyDesignAttribute = (design) => {
  const html = document.documentElement;
  if (design === DESIGNS.state.key) {
    html.setAttribute('data-design', DESIGNS.state.key);
  } else {
    html.removeAttribute('data-design');
  }
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
