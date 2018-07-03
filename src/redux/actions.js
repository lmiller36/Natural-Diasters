
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
        // selectedState : 
    });

    // return (dispatch) => {

    //     type: "UPDATE_SELECTED_STATE"

    // }

}


//   export function checkIfSupported(dispatch) {
//     var supported = true;
//     return (dispatch) => {
//       if (supported) {
//         return dispatch(isSetupNeeded())
//       }
//       else {
//         return dispatch({
//           type: "IS_NOT_SUPPORTED"
//         })
//       }
//     }

//   }

//   export function setUp(dispatch) {

//     var condition = false;
//     return (dispatch) => {
//       if (condition) {
//         return dispatch({
//           type: "SETUP_SUCCESSFUL"
//         })
//       }
//       else {
//         return dispatch({
//           type: "SETUP_FAILED"
//         })
//       }
//     }
//   }

//   export function updateRTButton(dispatch) {
//     var HideRTBothDeceased = false;
//     return (dispatch) => {
//       if (HideRTBothDeceased) {
//         return dispatch({
//           type: "HIDE_RT_BUTTON"
//         })
//       }
//       else {
//         return dispatch({
//           type: "SHOW_RT_BUTTON"
//         })
//       }

//     }
//   }

//   export function purchaseWithApplePay() {
//     //DO ApplePay.purchase(); ASYNC
//   }

//   export function purchaseWithCreditCard() {
//     //End topic and switch to credit card flow
//   }

export default constants;