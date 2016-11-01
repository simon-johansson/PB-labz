/*
 * Home Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  LOAD_LOCATION_SUCCESS,
  ADD_LOCATION,
  CHANGE_QUERY,
} from './constants';

export function changeQuery(query) {
  return {
    type: CHANGE_QUERY,
    query,
  };
}

export function addLocation(location) {
  return {
    type: ADD_LOCATION,
    location,
  };
}

export function locationsLoaded(locations) {
  return {
    type: LOAD_LOCATION_SUCCESS,
    locations,
  };
}
