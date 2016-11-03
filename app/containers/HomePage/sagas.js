/**
 * Gets the repositories of the user from Github
 */

import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  LOAD_REPOS,
  LOAD_JOBS,
} from 'containers/App/constants';
import {
  REMOVE_OCCUPATION,
  REMOVE_LOCATION,
} from 'containers/HomePage/constants';
import {
  reposLoaded,
  repoLoadingError,
  jobsLoaded,
  jobsLoadingError,
} from 'containers/App/actions';

import request from 'utils/request';
import {
  selectUsername,
  selectOccupations,
  selectLocations,
} from 'containers/HomePage/selectors';

export function* getJobs() {

  const occupation = yield select(selectOccupations());
  const locations = yield select(selectLocations());
  const occupationPayload = occupation.map((item) => {
    let typ;
    switch (item.typ) {
      case 'YRKESOMRADE':
        typ = 'YRKESOMRADE_ROLL';
        break;
      case 'YRKE':
        typ = 'YRKESROLL';
        break;
      default:
        typ = item.typ;
    }

    return {
      typ,
      varde: item.id || item.varde,
      // egenskaper: [],
    };
  });
  const locationPayload = locations.map((item) => {
    return {
      typ: item.typ,
      varde: item.id,
    };
  });

  // console.log(selectOccupation().map(item => console.log(item)));

  const requestURL = '/matchandeRekryteringsbehov';
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      matchningsprofil: {
        profilkriterier: [...occupationPayload, ...locationPayload],
        hasChanged: true,
      },
      maxAntal: 200,
      startrad: 0,
      sorteringsordning: 'RELEVANS',
    }),
  };

  // Call our request helper (see 'utils/request')
  const jobs = yield call(request, requestURL, options);

  if (!jobs.err) {
    // console.log(jobs.data);
    yield put(jobsLoaded(jobs.data));
  } else {
    // yield put(jobsLoadingError(jobs.err));
  }
}

export function* getJobsWatcher() {
  yield [
    fork(takeLatest, LOAD_JOBS, getJobs),
    fork(takeLatest, REMOVE_OCCUPATION, getJobs),
    fork(takeLatest, REMOVE_LOCATION, getJobs),
  ];
  // yield fork(takeLatest, LOAD_JOBS, getJobs);
}

export function* afData() {
  const watcher = yield fork(getJobsWatcher);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

/**
 * Github repos request/response handler
 */
export function* getRepos() {
  // Select username from store
  const username = yield select(selectUsername());
  const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;

  // Call our request helper (see 'utils/request')
  const repos = yield call(request, requestURL);

  if (!repos.err) {
    yield put(reposLoaded(repos.data, username));
  } else {
    yield put(repoLoadingError(repos.err));
  }
}

/**
 * Watches for LOAD_REPOS actions and calls getRepos when one comes in.
 * By using `takeLatest` only the result of the latest API call is applied.
 */
export function* getReposWatcher() {
  yield fork(takeLatest, LOAD_REPOS, getRepos);
}

/**
 * Root saga manages watcher lifecycle
 */
export function* githubData() {
  // Fork watcher so we can continue execution
  const watcher = yield fork(getReposWatcher);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  githubData,
  afData,
];
