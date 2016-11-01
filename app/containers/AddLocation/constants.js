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

export const CHANGE_LOCATION = 'boilerplate/AddLocation/CHANGE_LOCATION';
export const CHANGE_QUERY = 'boilerplate/AddLocation/CHANGE_QUERY';
export const LOAD_LOCATION_SUCCESS = 'boilerplate/AddLocation/LOAD_LOCATION_SUCCESS';
export const ADD_LOCATION = 'boilerplate/AddLocation/ADD_LOCATION';
