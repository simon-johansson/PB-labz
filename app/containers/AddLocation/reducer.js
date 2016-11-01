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
  LOAD_LOCATION_SUCCESS,
  CHANGE_QUERY,
} from './constants';
import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  query: '',
  locations: [],
  error: false,
});

function addLocationReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_QUERY:
      return state
        .set('query', action.query);
    case LOAD_LOCATION_SUCCESS:
      return state
        .set('locations', action.locations.splice(0, 10));
    default:
      return state;
  }
}

export default addLocationReducer;
