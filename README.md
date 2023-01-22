## Local Installation instructions

- git clone
- yarn install
- copy .env.dist to .env, and setup real values
- Install polkadotjs browser extension https://polkadot.js.org/extension/ and add non citizen, citizen, and assemblyMember accounts from seeds
- for local development, run yarn run dev and Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

### Linting
To autolint, run
yarn run eslint --fix

## Build for production

 - run yarn build
 
## Default wallets
You can add the following to the polkadotjs browser extension to use them
Steve (citizen)
bargain album current caught tragic slab identify squirrel embark black drip imitate
5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym


##Local development
Local dev - start api and auth servers, both with nvm use 10.21.0
api- PORT=8010 npm run start
sso- npm run development
web old - npm run start
cdn - PORT=8020 npm run start
chain explorer - https://github.com/liberland/chain_explorer/ - setup the dev instance as described in README with graphql engine running on port 3000

blockchain cargo run --release -- --dev

nvm use 14.19.3 
liberland-backend yarn run dev
liberland-frontend yarn run dev

https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944
http://localhost:8080
