
import constants from './actions'


function performAction(state = [], action) {
    switch (action.type) {
        case constants.RESETSTORE:
            state = {
                selectedState: ""
            };
            return state;

        case constants.UPDATESELECTEDSTATE:
            state = {
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
