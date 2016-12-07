/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import {
  REMOVE_OCCUPATION,
  REMOVE_LOCATION,
  SET_UI_STATE,
  SET_OCCUPATION,
  SET_LOCATION,
  SHOULD_LOAD_NEW_JOBS,
} from './constants';

import {
  LOAD_JOBS_SUCCESS,
  LOAD_ADDITIONAL_JOBS,
} from '../App/constants';

import {
  ADD_OCCUPATION,
} from '../AddOccupation/constants';

import {
  ADD_LOCATION,
} from '../AddLocation/constants';

import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  username: '',
  occupations: fromJS([]),
  locations: fromJS([]),
  filter: fromJS({}),
  shouldLoadNewJobs: true,
  uiState: fromJS({
    tab: 'all',
    showMatchingJobs: false,
    showNonMatchningJobs: false,
    scrollPosition: 0,
  }),
});

function listReducer(state = initialState, action) {
  switch (action.type) {

    case ADD_OCCUPATION:
      const addOccupation = state.get('occupations').filter((item, index) => {
        return action.occupation.id !== item.id;
      }).push(action.occupation);
      return state
        .set('occupations', addOccupation)
        .setIn(['uiState', 'showMatchingJobs'], false)
        .setIn(['uiState', 'showNonMatchningJobs'], false)
        .set('shouldLoadNewJobs', true);

    case LOAD_ADDITIONAL_JOBS:
      if (action.additional.occupations) {
        const addAdditionalOccupation = state.get('occupations').filter((item, index) => {
          return action.additional.occupations.id !== item.id;
        }).push(action.additional.occupations);
        return state.set('occupations', addAdditionalOccupation);
      } else if (action.additional.locations) {
        const addAdditionalLocation = state.get('locations').filter((item, index) => {
          return action.additional.locations.id !== item.id;
        }).push(action.additional.locations);
        return state.set('locations', addAdditionalLocation);
      }

    case REMOVE_OCCUPATION:
      let occupations = state.get('occupations').filter((item, index) => action.index !== index);
      if (!action.shouldReload && typeof action.shouldReload !== 'undefined') {
        return state.set('occupations', occupations);
      }
      return state
        .set('occupations', occupations)
        .setIn(['uiState', 'showMatchingJobs'], false)
        .setIn(['uiState', 'showNonMatchningJobs'], false)
        .set('shouldLoadNewJobs', true);

    case ADD_LOCATION:
      let addLocation = state.get('locations').filter((item, index) => {
        return action.location.id !== item.id;
      }).push(action.location);
      return state
        .set('locations', addLocation)
        .setIn(['uiState', 'showMatchingJobs'], false)
        .setIn(['uiState', 'showNonMatchningJobs'], false)
        .set('shouldLoadNewJobs', true);

    case REMOVE_LOCATION:
      const locations = state.get('locations').filter((item, index) => action.index !== index);
      if (!action.shouldReload && typeof action.shouldReload !== 'undefined') {
        return state.set('locations', locations);
      }
      return state
        .set('locations', locations)
        .setIn(['uiState', 'showMatchingJobs'], false)
        .setIn(['uiState', 'showNonMatchningJobs'], false)
        .set('shouldLoadNewJobs', true);

    case SET_OCCUPATION:
      return state
        .set('occupations', state.get('occupations').clear())
        .updateIn(['occupations'], (arr) => arr.push(...action.occupations))
        .setIn(['uiState', 'showMatchingJobs'], false)
        .setIn(['uiState', 'showNonMatchningJobs'], false)
        .set('shouldLoadNewJobs', true);

    case SET_LOCATION:
      return state
        .set('locations', state.get('locations').clear())
        .updateIn(['locations'], (arr) => arr.push(...action.locations))
        .setIn(['uiState', 'showMatchingJobs'], false)
        .setIn(['uiState', 'showNonMatchningJobs'], false)
        .set('shouldLoadNewJobs', true);

    case LOAD_JOBS_SUCCESS:
      return state.set('shouldLoadNewJobs', false);

    case SET_UI_STATE:
      return state
        .setIn(['uiState', 'tab'], action.tab)
        .setIn(['uiState', 'showMatchingJobs'], action.showMatchingJobs)
        .setIn(['uiState', 'showNonMatchningJobs'], action.showNonMatchningJobs)
        .setIn(['uiState', 'scrollPosition'], action.scrollPosition);

    case SHOULD_LOAD_NEW_JOBS:
      return state.set('shouldLoadNewJobs', true);

    default:
      return state;
  }
}

export default listReducer;
