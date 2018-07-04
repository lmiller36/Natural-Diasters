import React, {
  Component
} from 'react';
import generateCountyBorders from '../components/CountyBorders';
import stateCenters from '../csv/state_centers.json';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import CustomizedSlider from './CustomizedSlider';
import buildStateBorders from './StateBorders';


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
          <CustomizedSlider onUpdate={(value) => (this.handleSliderChange(value))} />
        </div>

      </div>


    );

  }
}
export const GoogleMaps = GoogleApiWrapper({
  apiKey: 'AIzaSyDRxBYiF5OC6YDFwVpctIeFjtHg5C7VEKI',
  libraries: ['visualization']
})(MapContainer);

export default MapContainer;