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
} from './constants';

import {
  LOAD_JOBS_SUCCESS,
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
      return state
        .updateIn(['occupations'], (arr) => arr.push(action.occupation))
        .setIn(['uiState', 'showMatchingJobs'], false)
        .setIn(['uiState', 'showNonMatchningJobs'], false)
        .set('shouldLoadNewJobs', true);

    case REMOVE_OCCUPATION:
      const occupations = state.get('occupations').filter((item, index) => action.index !== index);
      return state
        .set('occupations', occupations)
        .setIn(['uiState', 'showMatchingJobs'], false)
        .setIn(['uiState', 'showNonMatchningJobs'], false)
        .set('shouldLoadNewJobs', true);

    case ADD_LOCATION:
      return state
        .updateIn(['locations'], (arr) => arr.push(action.location))
        .setIn(['uiState', 'showMatchingJobs'], false)
        .setIn(['uiState', 'showNonMatchningJobs'], false)
        .set('shouldLoadNewJobs', true);

    case REMOVE_LOCATION:
      const locations = state.get('locations').filter((item, index) => action.index !== index);
      return state
        .set('locations', locations)
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
    default:
      return state;
  }
}

export default listReducer;
