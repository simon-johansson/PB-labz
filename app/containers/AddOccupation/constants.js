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

export const CHANGE_OCCUPATION = 'boilerplate/AddOccupation/CHANGE_OCCUPATION';
export const CHANGE_QUERY = 'boilerplate/AddOccupation/CHANGE_QUERY';
export const LOAD_OCCUPATION_SUCCESS = 'boilerplate/AddOccupation/LOAD_OCCUPATION_SUCCESS';
export const ADD_OCCUPATION = 'boilerplate/AddOccupation/ADD_OCCUPATION';
