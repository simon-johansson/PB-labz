/**
 * Gets the repositories of the user from Github
 */

import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import Fuse from 'fuse.js';
import yrken from '../../../yrken.json';
const options = {
  shouldSort: true,
  threshold: 0.3,
  tokenize: true,
  matchAllTokens: true,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  keys: ['namn'],
};
const fuse = new Fuse(yrken, options);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

import {
  CHANGE_QUERY,
  CHANGE_LIST_QUERY,
} from './constants';
import {
  occupationsLoaded,
  occupationListLoaded,
} from './actions';

import request from 'utils/request';
import {
  selectQuery,
  selectOccupationListQuery,
} from 'containers/AddOccupation/selectors';

export function* getOccupations() {
  yield call(delay, 300);

  const query = yield select(selectQuery());

  // const requestURL = `https://www.arbetsformedlingen.se/rest/matchning/rest/af/v1/matchning/matchningskriterier?namnfilter=${query}&typer=yrken&typer=yrkesgrupper&typer=yrkesomraden`;
  // const occupations = yield call(request, requestURL);

  // if (!occupations.err) {
  if (true) {
    // console.log(occupations);
    // yield put(occupationsLoaded(occupations.data));

    const result = fuse.search(query);
    yield put(occupationsLoaded(result));

  } else {
    // yield put(jobsLoadingError(jobs.err));
  }
}

export function* getOccupationsList() {

  const listQuery = yield select(selectOccupationListQuery());
  // console.log(query);

  const requestURL = `https://www.arbetsformedlingen.se/rest/matchning/rest/af/v1/matchning/matchningskriterier/${listQuery.group}?gruppid=${listQuery.id}`;
  const listItems = yield call(request, requestURL);

  if (!listItems.err) {
    // console.log(listItems);
    yield put(occupationListLoaded(listItems.data));
  } else {
    // yield put(jobsLoadingError(jobs.err));
  }
}

export function* getQueryWatcher() {
  yield fork(takeLatest, CHANGE_QUERY, getOccupations);
}

export function* getListWatcher() {
  yield fork(takeLatest, CHANGE_LIST_QUERY, getOccupationsList);
}

export function* occupationData() {
  const watcher = yield fork(getQueryWatcher);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* occupationListData() {
  const watcher = yield fork(getListWatcher);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  occupationData,
  occupationListData,
];
