/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectJobAdvert = () => (state) => state.get('advert');

const selectId = () => createSelector(
  selectJobAdvert(),
  (advertState) => advertState.get('id')
);

const selectAdvert = () => createSelector(
  selectJobAdvert(),
  (advertState) => advertState.get('advert')
);

export {
  selectId,
  selectAdvert,
};
