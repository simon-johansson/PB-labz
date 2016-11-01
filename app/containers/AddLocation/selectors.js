/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectAddLocation = () => (state) => state.get('location');

const selectQuery = () => createSelector(
  selectAddLocation(),
  (locationState) => locationState.get('query')
);

const selectLocations = () => createSelector(
  selectAddLocation(),
  (addLocationState) => addLocationState.get('locations')
);

export {
  selectAddLocation,
  selectQuery,
  selectLocations,
};
