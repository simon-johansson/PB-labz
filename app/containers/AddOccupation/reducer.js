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
  LOAD_OCCUPATION_SUCCESS,
  CHANGE_QUERY,
  CHANGE_LIST_QUERY,
  LOAD_OCCUPATION_LIST_SUCCESS,
} from './constants';
import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  query: '',
  occupations: [],
  error: false,
  occupationListQuery: '',
  occupationList: fromJS([]),
});

function addOccupationReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_QUERY:
      return state
        .set('query', action.query);
    case CHANGE_LIST_QUERY:
      return state
        .set('occupationListQuery', action.occupationListQuery);
    case LOAD_OCCUPATION_SUCCESS:
      return state
        .set('occupations', action.occupations.splice(0, 10));
    case LOAD_OCCUPATION_LIST_SUCCESS:
      return state
        .set('occupationList', state.get('occupationList').clear())
        .updateIn(['occupationList'], (arr) => arr.push(...action.occupationList));
    default:
      return state;
  }
}

export default addOccupationReducer;
