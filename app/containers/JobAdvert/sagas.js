/**
 * Gets the repositories of the user from Github
 */

import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { LOAD_ADVERT } from './constants';
import { advertLoaded } from './actions';

import request from 'utils/request';
import { selectId } from './selectors';

export function* getAdvert() {

  const id = yield select(selectId());
  // console.log(query);

  const requestURL = `/matchandeRekryteringsbehov/${id}`;
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  };
  const advert = yield call(request, requestURL, options);

  if (!advert.err) {
    yield put(advertLoaded(advert));
  } else {
    // yield put(jobsLoadingError(jobs.err));
  }
}

export function* getIdWatcher() {
  yield fork(takeLatest, LOAD_ADVERT, getAdvert);
}

export function* advertData() {
  const watcher = yield fork(getIdWatcher);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  advertData,
];
