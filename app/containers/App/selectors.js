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

const selectAreas = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.getIn(['afData', 'areas'])
);

const selectKnownCompetences = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.get('knownCompetences')
);

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
  selectAreas,
  selectKnownCompetences,
  selectLocationState,
};
