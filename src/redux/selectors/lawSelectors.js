import { createSelector } from 'reselect';

const lawReducer = (state) => state.law;

const isGetLawsSelector = createSelector(
  lawReducer,
  (reducer) => reducer.isGetLaws,
);

const currentLawsSelector = createSelector(
  lawReducer,
  (reducer) => reducer.currentLaws,
);

const constitutionalChangeSelector = createSelector(
  currentLawsSelector,
  (reducer) => reducer.filter((val) => val.draftType === 'ConstitutionalChange'),
);

const legislationSelector = createSelector(
  currentLawsSelector,
  (reducer) => reducer.filter((val) => val.draftType === 'Legislation'),
);

const decisionSelector = createSelector(
  currentLawsSelector,
  (reducer) => reducer.filter((val) => val.draftType === 'Decision'),
);

export {
  isGetLawsSelector,
  currentLawsSelector,
  constitutionalChangeSelector,
  legislationSelector,
  decisionSelector,
};
