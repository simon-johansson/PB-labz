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
  LOAD_ADVERT,
  LOAD_ADVERT_SUCCESS
} from './constants';
import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  advert: false,
  id: false,
});

function addOccupationReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_ADVERT:
      return state
        .set('id', action.id);
    case LOAD_ADVERT_SUCCESS:
      return state
        .set('advert', action.advert.data);
    default:
      return state;
  }
}

export default addOccupationReducer;
