import { createSelector } from 'reselect';

const userReducer = (state) => state.user;

const selectUser = createSelector(
  userReducer,
  (reducer) => reducer.user,
);

const selectUserRole = createSelector(
  selectUser,
  (user) => {
    if (!user) return null;
    return user.role;
  },
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

const selectGuidedStep = createSelector(
  userReducer,
  (reducer) => reducer.guidedStep,
);
const selectIsSessionVerified = createSelector(
  userReducer,
  (reducer) => reducer.isSessionVerified,
);

export {
  selectGuidedStep,
  selectUser,
  selectIsSessionVerified,
  selectUserRole,
  selectUserEmail,
  selectUserId,
  selectUserGivenName,
  selectUserFamilyName,
};
