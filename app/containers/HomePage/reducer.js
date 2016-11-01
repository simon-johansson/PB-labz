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
  CHANGE_USERNAME,
  REMOVE_OCCUPATION,
  REMOVE_LOCATION,
} from './constants';

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
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_USERNAME:
      // Delete prefixed '@' from the github username
      return state
        .set('username', action.name.replace(/@/gi, ''));
    case ADD_OCCUPATION:
      return state
        .updateIn(['occupations'], (arr) => arr.push(action.occupation));
    case REMOVE_OCCUPATION:
      const occupations = state.get('occupations').filter((item, index) => action.index !== index);
      return state
        .set('occupations', occupations);
    case ADD_LOCATION:
      return state
        .updateIn(['locations'], (arr) => arr.push(action.location));
    case REMOVE_LOCATION:
      const locations = state.get('locations').filter((item, index) => action.index !== index);
      return state
        .set('locations', locations);
    default:
      return state;
  }
}

export default homeReducer;
