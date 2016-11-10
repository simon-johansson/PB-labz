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
  LOAD_OCCUPATION_SUCCESS,
  ADD_OCCUPATION,
  CHANGE_QUERY,
  CHANGE_LIST_QUERY,
  LOAD_OCCUPATION_LIST_SUCCESS,
} from './constants';

export function changeQuery(query) {
  return {
    type: CHANGE_QUERY,
    query,
  };
}

export function changeOccupationListQuery(group, id = '') {
  return {
    type: CHANGE_LIST_QUERY,
    occupationListQuery: {
      group, id,
    },
  };
}

export function addOccupation(occupation) {
  return {
    type: ADD_OCCUPATION,
    occupation,
  };
}

export function occupationListLoaded(occupationList) {
  return {
    type: LOAD_OCCUPATION_LIST_SUCCESS,
    occupationList,
  };
}

export function occupationsLoaded(occupations) {
  return {
    type: LOAD_OCCUPATION_SUCCESS,
    occupations,
  };
}
