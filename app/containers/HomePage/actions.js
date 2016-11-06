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
  CHANGE_USERNAME,
  REMOVE_OCCUPATION,
  REMOVE_LOCATION,
  SET_UI_STATE,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function changeUsername(name) {
  return {
    type: CHANGE_USERNAME,
    name,
  };
}

export function removeOccupation(occupationIndex) {
  return {
    type: REMOVE_OCCUPATION,
    index: occupationIndex,
  };
}

export function removeLocation(locationIndex) {
  return {
    type: REMOVE_LOCATION,
    index: locationIndex,
  };
}

export function setUiState(uiState) {
  return {
    type: SET_UI_STATE,
    tab: uiState.tab,
    showMatchingJobs: uiState.showMatchingJobs,
    scrollPosition: uiState.scrollPosition,
  };
}
