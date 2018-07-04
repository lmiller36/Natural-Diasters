
/*
 * action types
 */
export const constants = {
    RESETSTORE: 'RESET_STORE',
    UPDATESELECTEDSTATE: 'UPDATE_SELECTED_STATE'
};

/*
 * action creators
 */

export function updateSelectedState(dispatch) {

    return dispatch({
        type: 'UPDATE_SELECTED_STATE',
    });


}

export default constants;