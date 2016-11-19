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
  REMOVE_OCCUPATION,
  REMOVE_LOCATION,
  SET_UI_STATE,
  SET_OCCUPATION,
  SET_LOCATION,
  SHOULD_LOAD_NEW_JOBS,
} from './constants';

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

export function setOccupations(occupations = []) {
  return {
    type: SET_OCCUPATION,
    occupations,
  };
}

export function setLocations(locations = []) {
  return {
    type: SET_LOCATION,
    locations,
  };
}

export function shouldLoadNewJobs() {
  return {
    type: SHOULD_LOAD_NEW_JOBS,
  };
}

export function setUiState(uiState) {
  return {
    type: SET_UI_STATE,
    tab: uiState.tab,
    showMatchingJobs: uiState.showMatchingJobs,
    showNonMatchningJobs: uiState.showNonMatchningJobs,
    scrollPosition: uiState.scrollPosition,
  };
}
