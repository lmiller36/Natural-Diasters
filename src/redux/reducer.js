
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

        //     case constants.ISNOTSUPPORTED:
        //         state = {
        //             ...state,
        //             showApplePaySetupButton: false,
        //             showCreditCard: true,
        //             showApplePayOption: false
        //         };
        //         return state;

        //     case constants.SETUPNEEDED:
        //         state = {
        //             ...state,
        //             showApplePaySetupButton: true,
        //             showCreditCard: false,
        //             showApplePayOption: false
        //         };
        //         return state;

        //     case constants.SETUPSUCCESSFUL:
        //         state = {
        //             ...state,
        //             showApplePaySetupButton: false,
        //             showCreditCard: false,
        //             showApplePayOption: true
        //         };
        //         return state;

        //     case constants.SETUPFAILED:
        //         state = {
        //             ...state,
        //             showApplePaySetupButton: false,
        //             showCreditCard: true,
        //             showApplePayOption: false
        //         };
        //         return state;

        //     case constants.HIDERTBUTTON:
        //         state = {
        //             ...state,
        //             showRTButton: false
        //         };
        //         return state;

        //     case constants.SHOWRTBUTTON:
        //         state = {
        //             ...state,
        //             showRTButton: true
        //         };
        //         return state;

        default:
            {
                return {
                    ...state
                }
            }
    }
}

export default performAction
