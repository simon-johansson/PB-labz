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

import _ from 'lodash';
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
  SET_DRIVERS_LICENSE,
  REMOVE_DRIVERS_LICENSE,
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
  knownDriversLicenses: [],
  userData: fromJS({
    repositories: false,
  }),
  afData: fromJS({
    jobs: false,
    matchingJobs: false,
    nonMatchingJobs: false,
    amount: false,
    related: false,
    competences: false,
    experiences: false,
    driverLicenses: false,
    areas: false,
    hasMatchningJobs: false,
  }),
  additional: fromJS({
    searchParameters: fromJS([]),
    ads: fromJS([]),
  }),
});

const isCompetence = (type) => type === 'KOMPETENS';
const isExperience = (type) => type === 'YRKE';
const isDriversLicense = (type) => type === 'KORKORT';
const isKnownCompetence = (id, knownComp, callback) => {
  if (knownComp.includes(id)) callback(true);
  else callback(false);
};
const isKnownExperience = (exp, knownExp, callback) => {
  let isMatch = false;
  knownExp.forEach((item) => {
    if (item.id === exp.varde) {
      if ((item.years + 1) >= parseInt(exp.niva.varde)) isMatch = true;
    }
  });
  callback(isMatch);
};
const isKnownDriversLicense = (id, knownDL, callback) => {
  if (knownDL.includes(id)) callback(true);
  else callback(false);
};
const getMatchProcentage = (matchningLen, job) => {
  return matchningLen / _.filter(job.matchningsresultat.efterfragat, (j) => {
    return isCompetence(j.typ) || isExperience(j.typ);
  }).length;
};

// hasmatching?
//
const findMatchningJobs = (
    jobs,
    knownCompetences,
    knownExperiences,
    knownDriversLicenses = [],
  ) => {
  const allJobs = [];
  const matchingJobs = [];
  const nonMatchingJobs = [];

  jobs.forEach((job) => {
    const jobCopy = JSON.parse(JSON.stringify(job));
    const matchingCriteria = [];
    const notMatchingCriteria = [];
    let isMatch = false;
    const onMatch = (req) => {
      matchingCriteria.push(req);
      isMatch = true;
      req.isKnown = true;
    };
    const onNotMatch = (req) => {
      notMatchingCriteria.push(req);
      req.isKnown = false;
    };

    // console.log(knownCompetences, knownExperiences);

    jobCopy.matchningsresultat.efterfragat.forEach((req) => {
      if (isCompetence(req.typ)) {
        isKnownCompetence(req.varde, knownCompetences, (isKnown) => {
          if (isKnown) onMatch(req);
          else onNotMatch(req);
        });
      } else if (isExperience(req.typ)) {
        isKnownExperience(req, knownExperiences, (isKnown) => {
          if (isKnown) onMatch(req);
          else onNotMatch(req);
        });
      } else if (isDriversLicense(req.typ)) {
        isKnownDriversLicense(req, knownDriversLicenses, (isKnown) => {
          if (isKnown) onMatch(req);
          else onNotMatch(req);
        });
      }
    });

    if (isMatch) {
      jobCopy.isMatch = true;
      jobCopy.matchingCriteria = matchingCriteria;
      jobCopy.notMatchingCriteria = notMatchingCriteria;
      jobCopy.matchProcent = getMatchProcentage(matchingCriteria.length, jobCopy);
      matchingJobs.push(jobCopy);
    } else {
      jobCopy.isMatch = false;
      nonMatchingJobs.push(jobCopy);
    }
    allJobs.push(jobCopy);
  });
  const sortedMatchingJobs = _.orderBy(matchingJobs,
    ['matchProcent', 'matchingCriteria', 'notMatchingCriteria'], ['desc', 'desc', 'asc']);

  return [allJobs, sortedMatchingJobs, nonMatchingJobs];
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    // case LOAD_REPOS:
    //   return state
    //     .set('loading', true)
    //     .set('error', false)
    //     .setIn(['userData', 'repositories'], false);
    // case LOAD_REPOS_SUCCESS:
    //   return state
    //     .setIn(['userData', 'repositories'], action.repos)
    //     .set('loading', false)
    //     .set('currentUser', action.username);
    // case LOAD_REPOS_ERROR:
    //   return state
    //     .set('error', action.error)
    //     .set('loading', false);

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
        .setIn(['afData', 'jobs'], false)
        .setIn(['afData', 'matchingJobs'], false)
        .setIn(['afData', 'nonMatchingJobs'], false);
    case LOAD_JOBS_SUCCESS: {
      const [allJobs, matchingJobs, nonMatchingJobs] = findMatchningJobs(
        action.jobs, state.get('knownCompetences'), state.get('knownExperiences')
      );

      return state
        .setIn(['afData', 'jobs'], allJobs)
        .setIn(['afData', 'matchingJobs'], matchingJobs)
        .setIn(['afData', 'nonMatchingJobs'], nonMatchingJobs)
        .setIn(['afData', 'hasMatchningJobs'], !!matchingJobs.length)
        .setIn(['afData', 'amount'], action.amount)
        .setIn(['afData', 'related'], action.related)
        .setIn(['afData', 'competences'], action.competences)
        .setIn(['afData', 'experiences'], action.experiences)
        .setIn(['afData', 'driverLicenses'], action.driverLicenses)
        .setIn(['afData', 'areas'], action.areas)
        .set('loading', false);
    }
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
    case REMOVE_ADDITIONAL_JOB: {
      let additionalParam = state.getIn(['additional', 'searchParameters']).filter((item, index) => action.index !== index);
      let additionalJobs = state.getIn(['additional', 'ads']).filter((item, index) => action.index !== index);
      return state
        .setIn(['additional', 'searchParameters'], additionalParam)
        .setIn(['additional', 'ads'], additionalJobs);

      // return state
      //   .setIn(['afData', 'amount'], state.getIn(['afData', 'amount']) + action.data.amount)
      //   .updateIn(['additional', 'ads'], (arr) => arr.push(action.data));
    }

    case TOTAL_AMOUNT_LOADED:
      return state.set('totalAmount', action.amount);

    case SET_COMPETENCE: {
      const competences = state.get('knownCompetences').update((arr) => arr.push(action.id));
      const [allJobs, matchingJobs, nonMatchingJobs] = findMatchningJobs(
        state.getIn(['afData', 'jobs']), competences, state.get('knownExperiences')
      );
      return state
        .set('knownCompetences', competences)
        .setIn(['afData', 'jobs'], allJobs)
        .setIn(['afData', 'matchingJobs'], matchingJobs)
        .setIn(['afData', 'nonMatchingJobs'], nonMatchingJobs)
        .setIn(['afData', 'hasMatchningJobs'], !!matchingJobs.length);
    }
    case REMOVE_COMPETENCE: {
      const competences = state.get('knownCompetences').filter((item) => action.id !== item);
      const [allJobs, matchingJobs, nonMatchingJobs] = findMatchningJobs(
        state.getIn(['afData', 'jobs']), competences, state.get('knownExperiences')
      );
      return state
        .set('knownCompetences', competences)
        .setIn(['afData', 'jobs'], allJobs)
        .setIn(['afData', 'matchingJobs'], matchingJobs)
        .setIn(['afData', 'nonMatchingJobs'], nonMatchingJobs)
        .setIn(['afData', 'hasMatchningJobs'], !!matchingJobs.length);
    }

    case SET_EXPERIENCE: {
      const experiences = state.get('knownExperiences')
                            .filter((item) => action.id !== item.id)
                            .update((arr) => arr.push({ id: action.id, years: action.years }));
      const [allJobs, matchingJobs, nonMatchingJobs] = findMatchningJobs(
        state.getIn(['afData', 'jobs']), state.get('knownCompetences'), experiences
      );
      return state
        .set('knownExperiences', experiences)
        .setIn(['afData', 'jobs'], allJobs)
        .setIn(['afData', 'matchingJobs'], matchingJobs)
        .setIn(['afData', 'nonMatchingJobs'], nonMatchingJobs)
        .setIn(['afData', 'hasMatchningJobs'], !!matchingJobs.length);
    }
    case REMOVE_EXPERIENCE: {
      const experiences = state.get('knownExperiences').filter((item) => action.id !== item.id);
      const [allJobs, matchingJobs, nonMatchingJobs] = findMatchningJobs(
        state.getIn(['afData', 'jobs']), state.get('knownCompetences'), experiences
      );
      return state
        .set('knownExperiences', experiences)
        .setIn(['afData', 'jobs'], allJobs)
        .setIn(['afData', 'matchingJobs'], matchingJobs)
        .setIn(['afData', 'nonMatchingJobs'], nonMatchingJobs)
        .setIn(['afData', 'hasMatchningJobs'], !!matchingJobs.length);
    }

    case SET_DRIVERS_LICENSE: {
      const driversLicenses = state.get('knownDriversLicenses').update((arr) => arr.push(action.id));
      const [allJobs, matchingJobs, nonMatchingJobs] = findMatchningJobs(
        state.getIn(['afData', 'jobs']), state.get('knownCompetences'), state.get('knownExperiences'), driversLicenses
      );
      return state
        .set('knownDriversLicenses', driversLicenses)
        .setIn(['afData', 'jobs'], allJobs)
        .setIn(['afData', 'matchingJobs'], matchingJobs)
        .setIn(['afData', 'nonMatchingJobs'], nonMatchingJobs)
        .setIn(['afData', 'hasMatchningJobs'], !!matchingJobs.length);
    }
    case REMOVE_DRIVERS_LICENSE: {
      const driversLicenses = state.get('knownDriversLicenses').filter((item) => action.id !== item);
      const [allJobs, matchingJobs, nonMatchingJobs] = findMatchningJobs(
        state.getIn(['afData', 'jobs']), state.get('knownCompetences'), state.get('knownExperiences'), driversLicenses
      );
      return state
        .set('knownDriversLicenses', driversLicenses)
        .setIn(['afData', 'jobs'], allJobs)
        .setIn(['afData', 'matchingJobs'], matchingJobs)
        .setIn(['afData', 'nonMatchingJobs'], nonMatchingJobs)
        .setIn(['afData', 'hasMatchningJobs'], !!matchingJobs.length);
    }

    default:
      return state;
  }
}

export default appReducer;
