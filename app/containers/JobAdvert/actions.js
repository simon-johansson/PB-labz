
import {
  LOAD_ADVERT,
  LOAD_ADVERT_SUCCESS,
} from './constants';

export function loadAdvert(id) {
  return {
    type: LOAD_ADVERT,
    id,
  };
}

export function advertLoaded(advert) {
  return {
    type: LOAD_ADVERT_SUCCESS,
    advert,
  };
}
