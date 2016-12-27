/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_REPOS = 'boilerplate/App/LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'boilerplate/App/LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'boilerplate/App/LOAD_REPOS_ERROR';

export const LOAD_JOBS = 'boilerplate/App/LOAD_JOBS';
export const LOAD_JOBS_SUCCESS = 'boilerplate/App/LOAD_JOBS_SUCCESS';
export const LOAD_JOBS_ERROR = 'boilerplate/App/LOAD_JOBS_ERROR';

export const LOAD_ADDITIONAL_JOBS = 'boilerplate/App/LOAD_ADDITIONAL_JOBS';
export const LOAD_ADDITIONAL_JOBS_SUCCESS = 'boilerplate/App/LOAD_ADDITIONAL_JOBS_SUCCESS';
export const REMOVE_ADDITIONAL_JOB = 'boilerplate/App/REMOVE_ADDITIONAL_JOB';

export const SET_COMPETENCE = 'boilerplate/Home/SET_COMPETENCE';
export const REMOVE_COMPETENCE = 'boilerplate/Home/REMOVE_COMPETENCE';

export const SET_EXPERIENCE = 'boilerplate/Home/SET_EXPERIENCE';
export const REMOVE_EXPERIENCE = 'boilerplate/Home/REMOVE_EXPERIENCE';

export const SET_DRIVERS_LICENSE = 'boilerplate/Home/SET_DRIVERS_LICENSE';
export const REMOVE_DRIVERS_LICENSE = 'boilerplate/Home/REMOVE_DRIVERS_LICENSE';

export const GET_TOTAL_AMOUNT = 'boilerplate/Home/GET_TOTAL_AMOUNT';
export const TOTAL_AMOUNT_LOADED = 'boilerplate/Home/TOTAL_AMOUNT_LOADED';
