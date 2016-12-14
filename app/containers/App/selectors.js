/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = () => (state) => state.get('global');

const selectCurrentUser = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.get('currentUser')
);

const selectLoading = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.get('loading')
);

const selectError = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.get('error')
);

const selectRepos = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.getIn(['userData', 'repositories'])
);

const selectJobs = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.getIn(['afData', 'jobs'])
);

const selectAmount = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.getIn(['afData', 'amount'])
);

const selectRelated = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.getIn(['afData', 'related'])
);

const selectCompetences = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.getIn(['afData', 'competences'])
);

const selectExperiences = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.getIn(['afData', 'experiences'])
);

const selectDriverLicenses = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.getIn(['afData', 'driverLicenses'])
);

const selectAreas = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.getIn(['afData', 'areas'])
);

const selectKnownCompetences = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.get('knownCompetences')
);

const selectKnownExperiences = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.get('knownExperiences')
);

const selectTotalAmount = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.get('totalAmount')
);


const selectAdditionalSearchParameters = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.getIn(['additional', 'searchParameters'])
);

const selectAdditionalAds = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.getIn(['additional', 'ads'])
);

// const selectAdditionalOccupations = () => createSelector(
//   selectGlobal(),
//   (globalState) => globalState.getIn(['additional', 'occupations'])
// );

// const selectAdditionalJobs = () => createSelector(
//   selectGlobal(),
//   (globalState) => globalState.getIn(['additional', 'jobs'])
// );

// const selectLoadingAdditional = () => createSelector(
//   selectGlobal(),
//   (globalState) => globalState.getIn(['additional', 'loading'])
// );

// const selectAdditionalAmount = () => createSelector(
//   selectGlobal(),
//   (globalState) => globalState.getIn(['additional', 'amount'])
// );

const selectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

export {
  selectGlobal,
  selectCurrentUser,
  selectLoading,
  selectError,
  selectRepos,
  selectJobs,
  selectAmount,
  selectRelated,
  selectCompetences,
  selectExperiences,
  selectDriverLicenses,
  selectAreas,
  selectKnownCompetences,
  selectKnownExperiences,
  selectTotalAmount,
  selectLocationState,
  selectAdditionalSearchParameters,
  selectAdditionalAds,
  // selectAdditionalOccupations,
  // selectAdditionalJobs,
  // selectAdditionalAmount,
  // selectLoadingAdditional,
};
