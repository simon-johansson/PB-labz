/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectAddOccupation = () => (state) => state.get('occupation');

const selectQuery = () => createSelector(
  selectAddOccupation(),
  (occupationState) => occupationState.get('query')
);

const selectOccupations = () => createSelector(
  selectAddOccupation(),
  (addOccupationState) => addOccupationState.get('occupations')
);

export {
  selectAddOccupation,
  selectQuery,
  selectOccupations,
};
