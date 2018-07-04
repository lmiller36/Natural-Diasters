import React, {
  Component
} from 'react';
import * as actions from './redux/actions';
import { connect } from 'react-redux';
import generateCountyBorders from './components/CountyBorders';
import stateCenters from './csv/state_centers.json';
import { Map, InfoWindow, GoogleApiWrapper } from 'google-maps-react';
// import CustomizedSlider from './components/CustomizedSlider';
import buildStateBorders from './components/StateBorders';
import configureAndResetStore from './redux/configure-store';
import { Provider } from 'react-redux';
import { GoogleMaps } from './components/Map';
export const store = configureAndResetStore();


function parseYearMonth(yearMonth) {
  var year = (yearMonth + '').substring(0, 4);
  var monthNum = (yearMonth + '').substring(5);
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var month = months[parseInt(monthNum)];
  //console.log(month + ", " + year);
  return month + "," + year;
}


class Main extends Component {

  constructor(props) {
    super(props);
  }

  callbackClickedState(state) {
    store.dispatch({
      type: 'UPDATE_SELECTED_STATE',
      selectedState: state
    });
  }


  render() {
    return (
      <GoogleMaps callbackClickedState={this.callbackClickedState} />

    );
  }
}

const mapStateToProps = (state) => ({
  selectedState: state.selectedState
});

const mapDispatchToProps = (dispatch) => ({
  updateSelectedState: () => dispatch(actions.updateSelectedState())
});

const MainConnected = connect(mapStateToProps, mapDispatchToProps)(Main);

class Wrapper extends Component {

  render() {
    return (
      <Provider store={store}>
        <MainConnected />
      </Provider>
    );
  }
}


export default (Wrapper);
