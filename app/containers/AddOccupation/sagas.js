/**
 * Gets the repositories of the user from Github
 */

import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  CHANGE_QUERY,
} from 'containers/AddOccupation/constants';
import {
  occupationsLoaded,
} from 'containers/AddOccupation/actions';

import request from 'utils/request';
import {
  selectQuery,
} from 'containers/AddOccupation/selectors';

export function* getOccupations() {

  const query = yield select(selectQuery());
  // console.log(query);

  const requestURL = `https://www.arbetsformedlingen.se/rest/matchning/rest/af/v1/matchning/matchningskriterier?namnfilter=${query}&typer=yrken&typer=yrkesgrupper&typer=yrkesomraden`;
  const occupations = yield call(request, requestURL);

  if (!occupations.err) {
    // console.log(occupations);
    yield put(occupationsLoaded(occupations.data));
  } else {
    // yield put(jobsLoadingError(jobs.err));
  }
}

export function* getQueryWatcher() {
  yield fork(takeLatest, CHANGE_QUERY, getOccupations);
}

export function* occupationData() {
  const watcher = yield fork(getQueryWatcher);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  occupationData,
];
