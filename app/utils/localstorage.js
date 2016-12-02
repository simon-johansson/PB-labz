
import ls from 'local-storage';
const BASE_KEY = 'pb-labz';
const PREVIOUS_SEARCH = 'previous-search';
const FAVORITE_SEARCH = 'favorite-search';

const getBase = () => ls(BASE_KEY) || {};
const setBase = (data) => ls(BASE_KEY, data);

export function get(key = BASE_KEY) {
  return getBase()[key];
}

export function set(key, data) {
  const base = getBase();
  base[key] = data;
  setBase(base);
}

export function setIn(key, index, data) {
  const base = getBase();
  const arr = base[key] || [];
  arr[index] = data;
  base[key] = arr;
  setBase(base);
}

export function pushIn(key, data) {
  const base = getBase();
  const arr = base[key] || [];
  arr.push(data);
  base[key] = arr;
  setBase(base);
}

export function unshiftIn(key, data) {
  const base = getBase();
  const arr = base[key] || [];
  arr.unshift(data);
  base[key] = arr;
  setBase(base);
}

export function deleteIn(key, index) {
  const base = getBase();
  const arr = base[key] || [];
  arr.splice(index, 1);
  base[key] = arr;
  setBase(base);
}

export function newPreviousSearch(data) { unshiftIn(PREVIOUS_SEARCH, data); }
export function deletePreviousSearch(index) { deleteIn(PREVIOUS_SEARCH, index); }

export function newFavoriteSearch(data) { unshiftIn(FAVORITE_SEARCH, data); }
export function setFavoriteSearchs(data) { set(FAVORITE_SEARCH, data); }
export function deleteFavoriteSearch(index) { deleteIn(FAVORITE_SEARCH, index); }

export function getPreviousSearchs() { return get(PREVIOUS_SEARCH) || []; }
export function getFavoriteSearchs() { return get(FAVORITE_SEARCH) || []; }