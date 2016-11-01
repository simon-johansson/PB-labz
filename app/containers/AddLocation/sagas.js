/**
 * Gets the repositories of the user from Github
 */

import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  CHANGE_QUERY,
} from 'containers/AddLocation/constants';
import {
  locationsLoaded,
} from 'containers/AddLocation/actions';

import request from 'utils/request';
import {
  selectQuery,
} from 'containers/AddLocation/selectors';

export function* getLocations() {

  const query = yield select(selectQuery());
  // console.log(query);

  const requestURL = `http://pilot.arbetsformedlingen.se:80/pbv3api/rest/af/v1/matchning/matchningskriterier?namnfilter=${query}&typer=kommuner&typer=lan&typer=land`;
  const locations = yield call(request, requestURL);

  if (!locations.err) {
    // console.log(locations);
    yield put(locationsLoaded(locations.data));
  } else {
    // yield put(jobsLoadingError(jobs.err));
  }
}

export function* getQueryWatcher() {
  yield fork(takeLatest, CHANGE_QUERY, getLocations);
}

export function* locationData() {
  const watcher = yield fork(getQueryWatcher);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  locationData,
];
