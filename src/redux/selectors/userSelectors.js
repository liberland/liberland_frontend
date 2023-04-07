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
const selectUserOrigin = createSelector(
  selectUser,
  (user) => {
    if (!user) return null;
    return user.origin;
  },
);
const selectUserAbout = createSelector(
  selectUser,
  (user) => {
    if (!user) return null;
    return user.about;
  },
);
const selectUserOccupation = createSelector(
  selectUser,
  (user) => {
    if (!user) return null;
    return user.occupation;
  },
);
const selectUserGender = createSelector(
  selectUser,
  (user) => {
    if (!user) return null;
    return user.gender;
  },
);
const selectUserLanguages = createSelector(
  selectUser,
  (user) => {
    if (!user) return null;
    return user.languages;
  },
);
const selectIsSessionVerified = createSelector(
  userReducer,
  (reducer) => reducer.isSessionVerified,
);

const selectIsSignInFetching = createSelector(
  userReducer,
  (reducer) => reducer.isSignInFetching,
);

export {
  selectUser,
  selectIsSessionVerified,
  selectUserRole,
  selectUserEmail,
  selectUserId,
  selectIsSignInFetching,
  selectUserAbout,
  selectUserGivenName,
  selectUserFamilyName,
  selectUserOrigin,
  selectUserOccupation,
  selectUserGender,
  selectUserLanguages,
};
