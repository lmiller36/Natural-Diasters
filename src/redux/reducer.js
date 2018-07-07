
// import constants from './actions'

/*
 * action types
 */
const constants = {
    RESETSTORE: 'RESET_STORE',
    UPDATESELECTEDSTATE: 'UPDATE_SELECTED_STATE'
};

function performAction(state = [], action) {
    switch (action.type) {
        case constants.RESETSTORE:
            state = {
                selectedState: ""
            };
            return state;

        case constants.UPDATESELECTEDSTATE:
            state = {
                ...state,
                selectedState: action.selectedState
            };
            return state;
        default:
            {
                return {
                    ...state
                }
            }
    }
}

export default performAction
