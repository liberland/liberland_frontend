import {
  put, call, takeLatest, take, race, delay,
  select,
} from 'redux-saga/effects';
import { providers } from 'ethers';
import orderBy from 'lodash/orderBy';
import { eventChannel } from 'redux-saga';
import { isAddress as isAddressPolkadot } from '@polkadot/util-crypto';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { isAddress as isAddressEth } from 'thirdweb';
import { blockchainActions } from '../actions';
import {
  subscribeActiveEra, subscribeBestBlockNumber, fetchPreimage,
} from '../../api/nodeRpcCall';
import { blockchainWatcherEvery } from './base';
import { getEthApi } from '../../api/ethereum';
import { blockchainSelectors } from '../selectors';

// WORKERS
function* clearErrorsWorker(action) {
  yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(action.payload));
  yield put(blockchainActions.setError.success(''));
}

function* fetchPreimageWorker({ payload: { hash, len } }) {
  const preimage = yield call(fetchPreimage, hash, len);
  yield put(blockchainActions.fetchPreimage.success({
    hash, preimage,
  }));
}

// WATCHERS

export function* clearErrorsWatcher() {
  yield takeLatest(blockchainActions.setErrorExistsAndUnacknowledgedByUser.call, clearErrorsWorker);
}

export function* subscribeBestBlockNumberSaga() {
  const channel = eventChannel((emitter) => {
    const unsubPromise = subscribeBestBlockNumber(emitter);
    return () => unsubPromise.then((unsub) => unsub());
  });

  while (true) {
    const bestNumber = yield take(channel);
    yield put(blockchainActions.bestBlockNumber.value({
      bestNumber,
      timestamp: Date.now(),
    }));
  }
}

export function* subscribeActiveEraSaga() {
  const channel = eventChannel((emitter) => {
    const unsubPromise = subscribeActiveEra(emitter);
    return () => unsubPromise.then((unsub) => unsub());
  });

  while (true) {
    const activeEra = yield take(channel);
    yield put(blockchainActions.activeEra.value(activeEra));
  }
}

export function* fetchPreimageWatcher() {
  yield* blockchainWatcherEvery(blockchainActions.fetchPreimage, fetchPreimageWorker);
}

export function* subscribeWalletsSaga() {
  let checkTimeout = true;
  const channel = eventChannel((emitter) => {
    const updateWallets = async () => {
      const extensions = await web3Enable('Liberland dApp');
      const wallets = await web3Accounts();
      emitter({ extensions, wallets });
    };
    setTimeout(updateWallets, 500);
    const interval = setInterval(updateWallets, 5000);
    setTimeout(() => {
      clearInterval(interval);
      checkTimeout = false;
    }, 120000);
    return () => clearInterval(interval);
  });
  const ethChannel = eventChannel((emitter) => {
    let injected;
    let web3Provider;
    const interval = setInterval(async () => {
      const api = getEthApi();
      if (injected !== api) {
        injected = api;
        web3Provider?.removeAllListeners();
        web3Provider = new providers.Web3Provider(injected);
        web3Provider.on('accountsChanged', (accounts) => {
          emitter({ accounts });
        });
        const accounts = await web3Provider.send('eth_requestAccounts', []);
        emitter({ accounts });
      }
    }, 500);
    return () => clearInterval(interval);
  });
  while (true) {
    const { data, timeout, eth } = yield race({
      data: take(channel),
      eth: take(ethChannel),
      timeout: delay(20000),
    });
    if (timeout && checkTimeout) {
      yield put(blockchainActions.setExtensions.value([]));
      yield put(blockchainActions.setWallets.value([]));
    }
    const previous = yield select(blockchainSelectors.allWalletsSelector);
    if (data) {
      const { extensions, wallets } = data || { extensions: [], wallets: [] };
      const previousEth = previous?.filter((params) => params.eth) || [];
      yield put(blockchainActions.setExtensions.value(extensions));
      yield put(blockchainActions.setWallets.value(orderBy([
        ...previousEth,
        ...wallets
          .filter(({ address }) => isAddressEth(address) || isAddressPolkadot(address))
          .map((address) => ({ ...address, polkadot: true })),
      ], ({ address }) => address)));
    }
    if (eth) {
      const previousPolka = previous?.filter((params) => params.polkadot) || [];
      const accounts = (
        eth?.accounts || []
      ).map((address) => ({ address, eth: true }));
      yield put(
        blockchainActions.setWallets.value(orderBy([
          ...previousPolka,
          ...accounts,
        ], ({ address }) => address)),
      );
    }
  }
}
