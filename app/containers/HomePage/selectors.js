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

export {
  selectHome,
  selectUsername,
  selectOccupations,
  selectLocations,
};
