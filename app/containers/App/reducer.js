/*
 * AppReducer
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
  LOAD_REPOS_SUCCESS,
  LOAD_REPOS,
  LOAD_REPOS_ERROR,
  LOAD_JOBS,
  LOAD_JOBS_SUCCESS,
  LOAD_JOBS_ERROR,
  SET_COMPETENCE,
  REMOVE_COMPETENCE,
  SET_EXPERIENCE,
  REMOVE_EXPERIENCE,
  TOTAL_AMOUNT_LOADED,
  LOAD_ADDITIONAL_JOBS,
  LOAD_ADDITIONAL_JOBS_SUCCESS,
  REMOVE_ADDITIONAL_JOB,
} from './constants';
import {
  REMOVE_OCCUPATION,
  REMOVE_LOCATION,
} from 'containers/ListPage/constants';
import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  totalAmount: false,
  knownCompetences: [],
  knownExperiences: [],
  userData: fromJS({
    repositories: false,
  }),
  afData: fromJS({
    jobs: false,
    amount: false,
    related: false,
    competences: false,
    experiences: false,
    driverLicenses: false,
    areas: false,
  }),
  // additional: fromJS({
  //   occupations: [],
  //   jobs: false,
  //   amount: false,
  //   related: false,
  //   competences: false,
  //   areas: false,
  //   loading: false,
  // }),
  additional: fromJS({
    searchParameters: fromJS([]),
    ads: fromJS([]),
  }),
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_REPOS:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['userData', 'repositories'], false);
    case LOAD_REPOS_SUCCESS:
      return state
        .setIn(['userData', 'repositories'], action.repos)
        .set('loading', false)
        .set('currentUser', action.username);
    case LOAD_REPOS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);

    case LOAD_JOBS:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['additional', 'searchParameters'], fromJS([]))
        .setIn(['additional', 'ads'], fromJS([]))
        .setIn(['afData', 'jobs'], false);
    case REMOVE_OCCUPATION:
    case REMOVE_LOCATION:
      if (!action.shouldReload && typeof action.shouldReload !== 'undefined') return state;
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['afData', 'jobs'], false);
    case LOAD_JOBS_SUCCESS:
      return state
        .setIn(['afData', 'jobs'], action.jobs)
        .setIn(['afData', 'amount'], action.amount)
        .setIn(['afData', 'related'], action.related)
        .setIn(['afData', 'competences'], action.competences)
        .setIn(['afData', 'experiences'], action.experiences)
        .setIn(['afData', 'driverLicenses'], action.driverLicenses)
        .setIn(['afData', 'areas'], action.areas)
        .set('loading', false);
    case LOAD_JOBS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);

    case LOAD_ADDITIONAL_JOBS:
      // console.log(action.additional.occupations);
      return state.updateIn(['additional', 'searchParameters'], (arr) => arr.push(action.additional.occupations || action.additional.locations));
    case LOAD_ADDITIONAL_JOBS_SUCCESS:
      return state
        .setIn(['afData', 'amount'], state.getIn(['afData', 'amount']) + action.data.amount)
        .updateIn(['additional', 'ads'], (arr) => arr.push(action.data));
    case REMOVE_ADDITIONAL_JOB:
      let additionalParam = state.getIn(['additional', 'searchParameters']).filter((item, index) => action.index !== index);
      let additionalJobs = state.getIn(['additional', 'ads']).filter((item, index) => action.index !== index);
      return state
        .setIn(['additional', 'searchParameters'], additionalParam)
        .setIn(['additional', 'ads'], additionalJobs);

      return state
        .setIn(['afData', 'amount'], state.getIn(['afData', 'amount']) + action.data.amount)
        .updateIn(['additional', 'ads'], (arr) => arr.push(action.data));

    case TOTAL_AMOUNT_LOADED:
      return state.set('totalAmount', action.amount);

    case SET_COMPETENCE:
      return state.updateIn(['knownCompetences'], (arr) => arr.push(action.id));
    case REMOVE_COMPETENCE:
      const competences = state.get('knownCompetences').filter((item) => action.id !== item);
      return state.set('knownCompetences', competences);

    case SET_EXPERIENCE:
      // console.log(state.get('knownExperiences'));
      const setExperiences = state.get('knownExperiences')
                                  .filter((item) => action.id !== item.id)
                                  .update((arr) => arr.push({ id: action.id, years: action.years }));
      return state.set('knownExperiences', setExperiences);
    case REMOVE_EXPERIENCE:
      // console.log(action);
      const experiences = state.get('knownExperiences').filter((item) => action.id !== item.id);
      return state.set('knownExperiences', experiences);

    default:
      return state;
  }
}

export default appReducer;
