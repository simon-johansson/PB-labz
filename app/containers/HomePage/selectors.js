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

const selectLocation = () => createSelector(
  selectHome(),
  (homeState) => homeState.get('location')
);

export {
  selectHome,
  selectUsername,
  selectOccupations,
  selectLocation,
};
