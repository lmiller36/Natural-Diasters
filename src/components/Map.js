import React, {
  Component
} from 'react';
import Slider, { Range, createSliderWithTooltip } from 'rc-slider';
import stateCenters from '../csv/state_centers.json';
import { Map, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
import CustomizedSlider from './CustomizedSlider';
import { Borders, Quartiles, getFillColor, convertToLatLngArr } from './Borders';
import { CountyElement } from './County';
import 'rc-tooltip/assets/bootstrap.css';
import Tooltip from 'rc-tooltip';
import { store } from '../App';
import data2018 from '../csv/data_2018.json';
import State from './State'
const initCenter = {
  lat: 32.9582895,
  lng: -117.1600157
}, initialZoom = 4;

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.toggleInfoWindow = this.toggleInfoWindow.bind(this);

    var BordersObj = new Borders();
    this.state = {
      isVisible: false,
      infoWindowLat: 41,
      infoWindowLng: -116,
      infoWindowVisible: false,
      selectedState: "",
      stateQuartiles: new Quartiles(data2018, 4, true),
      boundsBoxes: BordersObj.boundsBoxes,
      state_borders_list: BordersObj.state_borders_list,
      county_borders_list: BordersObj.county_borders_list,
      RGB: [0, 0, 255]

    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    console.log(this.state.stateQuartiles);
  }

  //sets Info Window properties of the state given
  toggleInfoWindow(state) {
    var latLng = stateCenters[state.toUpperCase()];
    if (latLng != null) {
      this.setState({ infoWindowLat: latLng.lat });
      this.setState({ infoWindowLng: latLng.lng });
      this.setState({ state: state });
      this.setState({ infoWindowVisible: true });
    }

  }

  handleSliderChange(value) {
    console.log(value);
  }

  handleKeyDown(e) {
    const resetKey = "KeyR";
    if (e.code === resetKey) {
      console.log("reset screen");
      this.refs.mapElement.map.setZoom(initialZoom);
      this.refs.mapElement.map.setCenter(initCenter);
      this.setState({ infoWindowVisible: false });
      this.setState({ selectedState: "" })
    }
  }

  componentWillMount() {

    document.addEventListener("keydown", (e) => (this.handleKeyDown(e)));
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

    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);


    return (
      <div>
        <div ref="map" style={div}>
          <Map
            style={style}
            ref="mapElement"
            google={this.props.google}
            initialCenter={initCenter}
            center={this.props.center}
            clickableIcons={true}
            zoom={initialZoom}>

            <InfoWindow visible={this.state.infoWindowVisible} position={{ lat: this.state.infoWindowLat, lng: this.state.infoWindowLng }}>
              <div>
              </div>
            </InfoWindow>

            {this.state.state_borders_list.map((border) =>
              <State
                state={border.state}
                selectedState={window.selectedState}
                ref={border.state}
                onClick={(state) => {
                  this.props.callbackClickedState(border.state);
                  this.toggleInfoWindow(border.state);
                  this.setState({ selectedState: border.state });

                  this.refs.mapElement.map.fitBounds(this.state.boundsBoxes[border.state]);
                  this.refs.mapElement.map.panToBounds(this.state.boundsBoxes[border.state]);
                }}
                paths={convertToLatLngArr(border.border)}
                strokeColor={"#000000"}
                strokeOpacity={0.8}
                strokeWeight={2}
                fillColor={getFillColor(this.state.stateQuartiles.quartiles_state[border.state.toUpperCase()], this.state.stateQuartiles.quartile_range, false, this.state.RGB)}
                fillOpacity={0.35}
              />
              //getFillColor(this.state.stateQuartiles.quartiles_state[border.state.toUpperCase()], this.state.stateQuartiles.quartile_range, false, this.state.RGB)
            )}
            {this.state.county_borders_list.map((county) => {
              if (this.state.selectedState === county.state) {
                return <CountyElement
                  paths={convertToLatLngArr(county.coordinates)}
                  state={county.state}
                  strokeColor={"#000000"}
                  strokeOpacity={0.8}
                  strokeWeight={2}
                  fillColor={getFillColor(this.state.stateQuartiles.quartiles_county[county.state.toUpperCase()][county.name.toUpperCase()], this.state.stateQuartiles.quartile_range, true, this.state.RGB)}
                  fillOpacity={0.35}
                />;
              }
              return null;
            })
            }

          </Map>

        </div>
        <div style={range}>
          <CustomizedSlider onUpdate={(value) => { this.setState({ RGB: value }) }} />
          <br />
          <br />
          <Range count={2} defaultValue={[2017, 2018]} pushable={0} onAfterChange={() => (console.log('year chanage'))} min={1950} max={2018}
            marks={{

              1950: '1950',
              1975: '1975',
              2000: '2000',
              2018: '2018',

            }}
            tipFormatter={value => `${value}`}
          // handleStyle={[{ backgroundColor: 'yellow' }, { backgroundColor: 'gray' }]}
          // railStyle={{ backgroundColor: 'black' }}
          />



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