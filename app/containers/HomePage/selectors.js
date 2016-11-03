/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = () => (state) => state.get('home');

const selectUsername = () => createSelector(
  selectHome(),
  (homeState) => homeState.get('username')
);

const selectOccupations = () => createSelector(
  selectHome(),
  (homeState) => {
    return homeState.get('occupations');
  }
);

const selectLocations = () => createSelector(
  selectHome(),
  (homeState) => homeState.get('locations')
);

const selectUiState = () => createSelector(
  selectHome(),
  (homeState) => homeState.get('uiState')
);

const selectCurrentTab = () => createSelector(
  selectHome(),
  (homeState) => homeState.getIn(['uiState', 'tab'])
);

const selectShowMatchingJobs = () => createSelector(
  selectHome(),
  (homeState) => homeState.getIn(['uiState', 'showMatchingJobs'])
);

export {
  selectHome,
  selectUsername,
  selectOccupations,
  selectLocations,
  selectUiState,
  selectCurrentTab,
  selectShowMatchingJobs,
};
