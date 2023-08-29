## Local Installation instructions

```console
git clone {repo}
yarn install
cp .env.dist .env
```
In .env setup real values

- Install polkadotjs browser extension [https://polkadot.js.org/extension/](https://polkadot.js.org/extension/) and add non citizen, citizen, and assemblyMember accounts from seeds
- for local development, run `yarn run dev` and Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

### Linting

To autolint, run
```console
yarn run eslint --fix
```

## Build for production
```console
run yarn build
```
 
## Default wallets

You can add the following to the polkadotjs browser extension to use them
Steve (citizen)
Mnemonic phrase: `bargain album current caught tragic slab identify squirrel embark black drip imitate`
Address: `5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym`


## Local development

Start api and auth servers.

### API 
```console
nvm use 12
PORT=8020 npm run start
```

### SSO 
```console
nvm use 12
npm run start
```

### Web old 
```console
npm run start
```

### CDN
```console
PORT=8020 npm run start
```

### Chain explorer

[https://github.com/liberland/chain_explorer/](https://github.com/liberland/chain_explorer/)
Setup the dev instance as described in README with graphql engine running on port 3000

### Blockchain 
```console
cargo run --release -- --dev
```

### Liberland backend and frontend

Run the following command from their respective directories
```console
nvm use 14.19.3 
yarn run dev
```

### Polkadot explorer
[https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944](https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944)
