/*
 * App Actions
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

import _ from 'lodash';
import afAreas from './areas.json';
import {
  LOAD_REPOS,
  LOAD_REPOS_SUCCESS,
  LOAD_REPOS_ERROR,
  LOAD_JOBS,
  LOAD_JOBS_SUCCESS,
  LOAD_JOBS_ERROR,
  SET_COMPETENCE,
  REMOVE_COMPETENCE,
  TOTAL_AMOUNT_LOADED,
  LOAD_ADDITIONAL_JOBS,
  LOAD_ADDITIONAL_JOBS_SUCCESS,
  REMOVE_ADDITIONAL_JOB,
  GET_TOTAL_AMOUNT,
} from './constants';

/**
 * Load the repositories, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_REPOS
 */
export function loadRepos() {
  return {
    type: LOAD_REPOS,
  };
}

/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {array} repos The repository data
 * @param  {string} username The current username
 *
 * @return {object}      An action object with a type of LOAD_REPOS_SUCCESS passing the repos
 */
export function reposLoaded(repos, username) {
  return {
    type: LOAD_REPOS_SUCCESS,
    repos,
    username,
  };
}

/**
 * Dispatched when loading the repositories fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_REPOS_ERROR passing the error
 */
export function repoLoadingError(error) {
  return {
    type: LOAD_REPOS_ERROR,
    error,
  };
}

export function loadJobs() {
  return {
    type: LOAD_JOBS,
  };
}

export function loadAdditionalJobs(additional = {}) {
  return {
    type: LOAD_ADDITIONAL_JOBS,
    additional,
  };
}

const cleanJobData = (jobsData) =>  {
  let arr = [];
  let obj = {};
  let areasObj = {};

  // console.log(jobsData);

  jobsData.rekryteringsbehov.forEach(job => {
    if (!areasObj[job.yrkesomrade.namn]) areasObj[job.yrkesomrade.namn] = [];
    areasObj[job.yrkesomrade.namn].push(job);

    job.matchningsresultat.efterfragat.forEach(merit => {
      if (merit.typ === 'KOMPETENS') arr.push(merit);
    });
  });

  let areas = _.orderBy(Object.keys(areasObj).map(key => {
    let id;
    afAreas.forEach((area) => { if (key === area.namn) id = area.id; });
    return {
      namn: key,
      items: areasObj[key],
      amount: areasObj[key].length,
      id,
    };
  }), 'amount', 'desc');

  arr.forEach(item => {
    obj[item.varde] ? obj[item.varde]++ : obj[item.varde] = 1;
  });
  arr = arr.map(item => {
    item.timesRequested = obj[item.varde];
    return item;
  });
  const competences = _.sortBy(_.uniqBy(arr, 'varde'), ['efterfragat']);

  return {
    jobs: jobsData.rekryteringsbehov,
    amount: jobsData.antalRekryteringsbehov,
    related: jobsData.relateradeKriterier,
    competences,
    areas,
  };
};

export function jobsLoaded(jobsData) {
  const data = cleanJobData(jobsData);

  return {
    type: LOAD_JOBS_SUCCESS,
    ...data,
  };
}

export function jobsLoadingError(error) {
  return {
    type: LOAD_JOBS_ERROR,
    error,
  };
}

export function additionalJobsLoaded(jobsData) {
  const data = cleanJobData(jobsData);

  return {
    type: LOAD_ADDITIONAL_JOBS_SUCCESS,
    data,
  };
}

export function removeAdditionalJob(index) {
  return {
    type: REMOVE_ADDITIONAL_JOB,
    index,
  };
}

export function getTotalAmount() {
  return {
    type: GET_TOTAL_AMOUNT,
  };
}

export function totalAmountLoaded({ data }) {
  return {
    type: TOTAL_AMOUNT_LOADED,
    amount: data.antalRekryteringsbehov,
  };
}

export function setCompetence(id) {
  return {
    type: SET_COMPETENCE,
    id,
  };
};

export function removeCompetence(id) {
  return {
    type: REMOVE_COMPETENCE,
    id,
  };
};