import { createSelector } from 'reselect';

const userReducer = (state) => state.user;

const selectUser = createSelector(
  userReducer,
  (reducer) => reducer.user,
);

const selectUserEmail = createSelector(
  selectUser,
  (user) => {
    if (!user) return null;
    return user.email;
  },
);

const selectUserId = createSelector(
  selectUser,
  (user) => {
    if (!user) return null;
    return user.id;
  },
);
const selectUserGivenName = createSelector(
  selectUser,
  (user) => {
    if (!user) return null;
    return user.givenName;
  },
);
const selectUserFamilyName = createSelector(
  selectUser,
  (user) => {
    if (!user) return null;
    return user.familyName;
  },
);

const selectIsSessionReady = createSelector(
  userReducer,
  (reducer) => reducer.isSessionReady,
);

const selectIsLoading = createSelector(
  userReducer,
  (reducer) => reducer.isLoading,
);

const selectWalletAddress = createSelector(
  selectUser,
  (user) => user?.blockchainAddress,
);

export {
  selectUser,
  selectIsSessionReady,
  selectUserEmail,
  selectUserId,
  selectUserGivenName,
  selectUserFamilyName,
  selectWalletAddress,
  selectIsLoading,
};
