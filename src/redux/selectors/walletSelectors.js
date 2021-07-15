import { createSelector } from 'reselect';
import matchPowHelper from '../../utils/matchPowHelper';

const walletReducer = (state) => state.wallet;

const selectorWalletInfo = createSelector(
  walletReducer,
  (reducer) => reducer.walletInfo,
);

const selectorGettingWalletInfo = createSelector(
  walletReducer,
  (reducer) => reducer.gettingWalletInfo,
);

const selectorFreeBalance = createSelector(
  selectorWalletInfo,
  (reducer) => matchPowHelper(reducer.balance.free.amount),
);

const selectorWalletAddress = createSelector(
  selectorWalletInfo,
  (reducer) => reducer.address,
);

const selectorLiberstakeBalance = createSelector(
  selectorWalletInfo,
  (reducer) => matchPowHelper(reducer.balance.liberstake.amount),
);

const selectorPolkastakeBalance = createSelector(
  selectorWalletInfo,
  (reducer) => matchPowHelper(reducer.balance.polkastake.amount),
);

const selectorLiquidMeritsBalance = createSelector(
  selectorWalletInfo,
  (reducer) => matchPowHelper(reducer.balance.liquidMerits.amount),
);

const selectorTotalBalance = createSelector(
  selectorFreeBalance,
  selectorLiberstakeBalance,
  selectorPolkastakeBalance,
  selectorLiquidMeritsBalance,
  (free, liberstake, polkastake, liquidMerits) => (
    matchPowHelper(free + liberstake + polkastake + liquidMerits)
  ),
);

export {
  selectorWalletInfo,
  selectorGettingWalletInfo,
  selectorFreeBalance,
  selectorWalletAddress,
  selectorLiberstakeBalance,
  selectorPolkastakeBalance,
  selectorLiquidMeritsBalance,
  selectorTotalBalance,
};
