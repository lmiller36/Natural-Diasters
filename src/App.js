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

export const store = configureAndResetStore();

function parseYearMonth(yearMonth) {
  var year = (yearMonth + '').substring(0, 4);
  var monthNum = (yearMonth + '').substring(5);
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var month = months[parseInt(monthNum)];
  //console.log(month + ", " + year);
  return month + "," + year;
}



class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      infoWindowLat: 41,
      infoWindowLng: -116,
      state: "",
      state_borders: buildStateBorders(this.props.callbackClickedState),
      county_borders: generateCountyBorders()

    };
    this.toggleInfoWindow = this.toggleInfoWindow.bind(this);
    this.buildComponent = this.buildComponent.bind(this);

  }

  //sets Info Window properties of the state given
  toggleInfoWindow(state) {
    var latLng = stateCenters[state.toUpperCase()];
    if (latLng != null) {
      this.setState({ infoWindowLat: latLng.lat });
      this.setState({ infoWindowLng: latLng.lng });
      this.setState({ state: state });

    }

  }

  buildComponent(numStorms, state) {
    return state + " had " + numStorms + " storms in 2018";
  }

  handleSliderChange(value) {
    console.log(value);
  }

  render() {
    const style = {
      width: '60%',
      height: '80%'
    }

    const range = {
      width: '30%',
      height: '10%',
      float: "right",
    }


    return (
      <div>
        <div ref="map">
          <Map
            style={style}
            google={this.props.google}
            initialCenter={{
              lat: 32.9582895,
              lng: -117.1600157
            }}
            clickableIcons={true}
            zoom={4}
          >
            {/* {this.buildComponent(state_dist[this.state.state.toUpperCase()], this.state.state)} */}

            {/* <InfoWindow visible={true} position={{ lat: this.state.infoWindowLat, lng: this.state.infoWindowLng }}>
              <div>
              </div>
            </InfoWindow> */}


            {/* {listItems} */}
            {this.state.state_borders}
            {this.state.county_borders}
          </Map>

        </div>
        <div style={range}>
          {/* <CustomizedSlider onUpdate={(value) => (this.handleSliderChange(value))} /> */}
        </div>

      </div>


    );

  }
}



const GoogleMaps = GoogleApiWrapper({
  apiKey: 'AIzaSyDRxBYiF5OC6YDFwVpctIeFjtHg5C7VEKI',
  libraries: ['visualization']
})(MapContainer);

class Main extends Component {

  constructor(props) {
    super(props);
  }

  callbackClickedState(state) {
    console.log('here: ' + state);
    store.dispatch({
      type: 'UPDATE_SELECTED_STATE',
      selectedState: state
    });
    // console.log(this);
    // this.props.updateSelectedState();
  }

  componentDidMount() {
    //   store.dispatch({
    //     type: 'UPDATE_SELECTED_STATE'
    // });
    // store.updateSelectedState();
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

/**
 * function getMoviesFromApiAsync() {
  return fetch('http://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_040_00_20m.json')
    .then((response) => response.json())
    .then((responseJson) => {
      //console.log(responseJson);
      return responseJson.movies;
    })
    .catch((error) => {
      console.error(error);
    });
}

 */

     // const listItems = hasLat.map((list) =>
    //   <Marker
    //     position={{ lat: list.ENDLAT, lng: list.ENDLON }}></Marker>
    // );

    // const listItems = data2.map((list) =>
    //   <Marker title={parseYearMonth(list.YEARMONTH)}
    //     position={{ lat: list.LATITUDE, lng: list.LONGITUDE }}></Marker>
