# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Liberland Frontend is a React SPA for the Liberland blockchain governance platform. It provides wallet management, voting, legislation, company registry, identity management, staking, congress/senate operations, and NFT management.

## Commands

```bash
# Development server (localhost:8080)
npm run dev

# Production build (outputs to dist/)
npm run prod

# Lint
npm run eslint
npm run eslint --fix
```

There is no test suite. Pre-commit hooks run ESLint via Husky + lint-staged on staged .js/.jsx files with `--max-warnings=0`.

## Tech Stack

- **React 18** with React Router v5 (not v6 — uses `<Switch>`, `<Route component={}>` patterns)
- **Redux + Redux-Saga** for state management and async side effects
- **Reselect** for memoized selectors
- **Ant Design v5** as the UI component library
- **Webpack 5** (not CRA — custom webpack.config.js)
- **SCSS/SASS** for styling, with some Emotion CSS-in-JS
- **Polkadot.js API** (`@polkadot/api`) for blockchain interaction (primary chain)
- **Ethers.js + Thirdweb** for Ethereum/cross-chain bridge features
- **Axios** for REST API calls
- **GraphQL** for blockchain explorer queries

## Architecture

### State Management Pattern

Redux state is split into ~21 domain slices in `src/redux/reducers/` (wallet, voting, legislation, congress, senate, identity, nfts, dex, etc.). Each domain has corresponding:
- **Actions** in `src/redux/actions/` — created with `redux-actions`
- **Sagas** in `src/redux/sagas/` — handle async operations (blockchain queries, API calls)
- **Selectors** in `src/redux/selectors/` — memoized with Reselect

### API Layer

`src/api/` contains five integration modules:
- `backend.js` — Axios client with auth token interceptor (X-token header)
- `ethereum.js` — Ethereum/Web3 interactions via ethers.js
- `explorer.js` — GraphQL queries to chain explorer
- `middleware.js` — Middleware API calls
- `nodeRpcCall.js` — Direct RPC to Polkadot node

### Routing

`src/router/index.js` defines 50+ routes using React Router v5. Main authenticated routes nest under `/home/` (wallet, voting, legislation, offices, registries, staking, congress, senate, contracts, companies, nfts, documents). Auth routes are at `/liberland-login` and `/signup`.

### Authentication

OAuth2 PKCE flow via `react-oauth2-code-pkce`. Token stored in localStorage as `ROCP_token`. Admin mode activated via `?admin=true` URL parameter. Polkadot.js browser extension used for wallet signing.

### Component Structure

Components in `src/components/` are organized by feature domain (Wallet, Congress, Senate, Voting, Legislation, etc.). Each typically contains an `index.js` entry point with sub-components.

### Environment Configuration

Copy `.env.dist` to `.env` and configure. All variables prefixed with `REACT_APP_`. Key categories:
- Network endpoints (RPC, API, SSO, explorer, middleware)
- OAuth client IDs
- Blockchain/contract addresses
- Ethereum/Thirdweb config
- Feature flags (`REACT_APP_IS_*_DISCOURAGED`) to hide menu sections

## ESLint Rules

- Airbnb preset with React hooks plugin
- Max line length: 120 characters
- `no-param-reassign` and `jsx-a11y/label-has-associated-control` are off
- Underscore-prefixed variables exempt from no-unused-vars
