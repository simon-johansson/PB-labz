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
} from './constants';
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
} from './selectors';

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

  // console.log([...occupationPayload, ...locationPayload]);
  const payload = [...occupationPayload, ...locationPayload].length ?
                  [...occupationPayload, ...locationPayload] :
                  [{ typ: 'FRITEXT', varde: '**' }];

  const requestURL = '/matchandeRekryteringsbehov';
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      matchningsprofil: {
        profilkriterier: payload,
        hasChanged: true,
      },
      maxAntal: 100,
      startrad: 0,
      sorteringsordning: 'DATUM',
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


// Bootstrap sagas
export default [
  afData,
];
