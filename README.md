## Local Installation instructions

- Install polkadotjs browser extension [https://polkadot.js.org/extension/](https://polkadot.js.org/extension/) and add non citizen, citizen, and assemblyMember accounts from seeds
- Install MetaMask (or similar) browser extension [https://metamask.io/download/](https://metamask.io/download/) for using Ethereum features, such as staking
- For local development, run `yarn dev` and Open [http://localhost:8082](http://localhost:8082) to view it in the browser.
- In order to use correct Node and NPM versions, install NVM [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm) in order to easily switch between versions
- Install yarn as a wrapper for NPM [https://classic.yarnpkg.com/lang/en/docs/install/](https://classic.yarnpkg.com/lang/en/docs/install/)
- In order to simulate Solidity contracts locally, install [https://ethereum-blockchain-developer.com/2022-06-nft-truffle-hardhat-foundry/14-foundry-setup/](https://ethereum-blockchain-developer.com/2022-06-nft-truffle-hardhat-foundry/14-foundry-setup/) Foundry
- When emulating Solidity contracts, don't forget to replace addresses in your .env with correct contract addresses

### Local installation

```console
git clone {repo}
yarn install
cp .env.dist .env
```

### Linting

To autolint, run
```console
yarn eslint --fix
```

## Build for production
```console
yarn build
```
 
## Default wallets

You can add the following to the polkadotjs browser extension to use them
Steve (citizen)
Mnemonic phrase: `bargain album current caught tragic slab identify squirrel embark black drip imitate`
Address: `5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym`


## Development

### Local development

Use this command to start DEV server and connect to staging
```console
yarn dev
```

## Other important repos

### Middleware
Needed for self onboarding process
[https://github.com/liberland/liberland-blockchain-middleware](https://github.com/liberland/liberland-blockchain-middleware)

### Chain explorer
[https://github.com/liberland/chain_explorer/](https://github.com/liberland/chain_explorer/)
Setup the dev instance as described in README with graphql engine running on port 3000

## Blockchain

### Local Ethereum chain

```console
anvil --chain-id 1337
```

### Blockchain 
```console
cargo run --release -- --dev
```

### Polkadot explorer
[https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944](https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944)
