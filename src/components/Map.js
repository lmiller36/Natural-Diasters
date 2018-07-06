import React, {
  Component
} from 'react';
import generateCountyBorders from '../components/CountyBorders';
import stateCenters from '../csv/state_centers.json';
import { Map, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
import CustomizedSlider from './CustomizedSlider';
import { buildStateBorders, Quartiles, getFillColor } from './StateBorders';
import { CountyElement } from './County';
import { convertToLatLngArr } from './CountyBorders';
import states from '../csv/states.json';
import data2018 from '../csv/data_2018.json';
import State from './State'
class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.toggleInfoWindow = this.toggleInfoWindow.bind(this);

    var stateOutput = buildStateBorders();

    this.state = {
      isVisible: false,
      infoWindowLat: 41,
      selectedState: "",
      infoWindowLng: -116,
      state_borders_list: stateOutput[0],//this.props.callbackClickedState),
      stateQuartiles: new Quartiles(data2018, 4, true),
      county_borders_list: generateCountyBorders(),
      boundsBoxes: stateOutput[1]
    };
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
    const div = {
      visibility: "visible"
    }


    return (
      <div>
        <div ref="map" style={div}>
          <Map
            style={style}
            ref="mapElement"
            google={this.props.google}
            initialCenter={{
              lat: 32.9582895,
              lng: -117.1600157
            }}
            center={this.props.center}
            clickableIcons={true}
            zoom={4}




          >

            <InfoWindow visible={true} position={{ lat: this.state.infoWindowLat, lng: this.state.infoWindowLng }}>
              <div>
              </div>
            </InfoWindow>


            {this.state.state_borders_list.map((border) =>
              <State
                state={border.state}
                selectedState={window.selectedState}
                ref={border.state}
                onClick={(state) => {
                  this.refs.mapElement.map.fitBounds(this.state.boundsBoxes[border.state]);
                  this.refs.mapElement.map.panToBounds(this.state.boundsBoxes[border.state.toUpperCase]);
                }}
                paths={convertToLatLngArr(border.border)}
                strokeColor={"#000000"}
                strokeOpacity={0.8}
                strokeWeight={2}
                fillColor={getFillColor(this.state.stateQuartiles.quartiles_state[border.state.toUpperCase()], this.state.stateQuartiles.quartile_range, false)}
                fillOpacity={0.35}
              />

            )}
            {this.state.county_borders_list.map((county) => {
              if (this.state.selectedState === county.state) {
                return <CountyElement
                  paths={convertToLatLngArr(county.coordinates)}
                  state={county.state}
                  strokeColor={"#000000"}
                  strokeOpacity={0.8}
                  strokeWeight={2}
                  fillColor={getFillColor(this.state.stateQuartiles.quartiles_county[county.state.toUpperCase()][county.name.toUpperCase()], this.state.stateQuartiles.quartile_range, true)}
                  fillOpacity={0.35}
                />;
              }
              return null;
            })
            }

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