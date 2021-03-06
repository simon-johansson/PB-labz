
import ls from 'local-storage';
const BASE_KEY = 'pb-labz';
const PREVIOUS_SEARCH = 'previous-search';
const PREVIOUS_LOCATION = 'previous-location';
const FAVORITE_SEARCH = 'favorite-search';
const KNOWN_COMPETENCES = 'known-competences';
const KNOWN_EXPERIENCES = 'known-experiences';
const KNOWN_DRIVERS_LICENSES = 'known-drivers-licenses';

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

export function getPreviousLocation() { return get(PREVIOUS_LOCATION) || []; }
export function setPreviousLocation(data) { set(PREVIOUS_LOCATION, data); }

export function getKnownCompetences() { return get(KNOWN_COMPETENCES) || []; }
export function setKnownCompetences(data) { set(KNOWN_COMPETENCES, data); }

export function getKnownExperiences() { return get(KNOWN_EXPERIENCES) || []; }
export function setKnownExperiences(data) { set(KNOWN_EXPERIENCES, data); }

export function getKnownDriversLicenses() { return get(KNOWN_DRIVERS_LICENSES) || []; }
export function setKnownDriversLicenses(data) { set(KNOWN_DRIVERS_LICENSES, data); }