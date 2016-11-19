/*
 * HomeConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const REMOVE_OCCUPATION = 'boilerplate/Home/REMOVE_OCCUPATION';
export const REMOVE_LOCATION = 'boilerplate/Home/REMOVE_LOCATION';
export const SET_UI_STATE = 'boilerplate/Home/SET_UI_STATE';
export const SET_LOCATION = 'boilerplate/Home/SET_LOCATION';
export const SET_OCCUPATION = 'boilerplate/Home/SET_OCCUPATION';
export const SHOULD_LOAD_NEW_JOBS = 'boilerplate/Home/SHOULD_LOAD_NEW_JOBS';
