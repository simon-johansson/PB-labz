/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectList = () => (state) => state.get('list');

const selectOccupations = () => createSelector(
  selectList(),
  (homeState) => {
    return homeState.get('occupations');
  }
);

const selectLocations = () => createSelector(
  selectList(),
  (homeState) => homeState.get('locations')
);

const selectShouldLoadNewJobs = () => createSelector(
  selectList(),
  (homeState) => homeState.get('shouldLoadNewJobs')
);

const selectUiState = () => createSelector(
  selectList(),
  (homeState) => homeState.get('uiState')
);

const selectCurrentTab = () => createSelector(
  selectList(),
  (homeState) => homeState.getIn(['uiState', 'tab'])
);

const selectShowMatchingJobs = () => createSelector(
  selectList(),
  (homeState) => homeState.getIn(['uiState', 'showMatchingJobs'])
);

const selectShowNonMatchningJobs = () => createSelector(
  selectList(),
  (homeState) => homeState.getIn(['uiState', 'showNonMatchningJobs'])
);

const selectScrollPosition = () => createSelector(
  selectList(),
  (homeState) => homeState.getIn(['uiState', 'scrollPosition'])
);

export {
  selectList,
  selectOccupations,
  selectLocations,
  selectUiState,
  selectCurrentTab,
  selectShowMatchingJobs,
  selectShouldLoadNewJobs,
  selectShowNonMatchningJobs,
  selectScrollPosition,
};
