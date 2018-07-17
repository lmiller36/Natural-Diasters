import React, {
  Component
} from 'react';
import Slider, { Range, createSliderWithTooltip } from 'rc-slider';
import stateCenters from '../csv/state_centers.json';
import { Map, Marker, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
import CustomizedSlider from './CustomizedSlider';
import { Borders, Quartiles, getFillColor, convertToLatLngArr } from './Borders';
import { CountyElement } from './County';
import 'rc-tooltip/assets/bootstrap.css';
import Tooltip from 'rc-tooltip';
import { store } from '../App';
import data2018 from '../csv/data_2018.json';
import State from './State'
import PieChart from "react-svg-piechart"

const data = [
  { title: "Data 1", value: 100, color: "#FF00FF" },
  { title: "Data 2", value: 60, color: "#820e91" },
  { title: "Data 3", value: 30, color: "#91230d" },
  { title: "Data 4", value: 20, color: "#177519" },
  { title: "Data 5", value: 10, color: "#a1d9ce" },
]
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
      stateQuartiles: new Quartiles(4, true),
      boundsBoxes: BordersObj.boundsBoxes,
      state_borders_list: BordersObj.state_borders_list,
      county_borders_list: BordersObj.county_borders_list,
      RGB: [0, 0, 255],
      years: [2017, 2018],
      visibleMarkers: null

    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.updateYears = this.updateYears.bind(this);
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

  updateYears(values) {
    console.log(this);
    console.log(values);
    this.setState({ years: values });
    console.log(this)
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
      this.setState({ visibleMarkers: null });

    }
  }

  componentWillMount() {

    document.addEventListener("keydown", (e) => (this.handleKeyDown(e)));
  }

  componentDidMount() {

    // var legend = 
    this.refs.mapElement.map.controls[this.props.google.maps.ControlPosition.RIGHT_BOTTOM].push(this.refs.legend);

    this.props.google.maps.event.addListener(this.refs.InfoWindow, 'closeclick', function () {
      console.log('closed')
    });
  }

  render() {
    const style = {
      width: '60%',
      height: '80%'
    }

    var styleRect = {
      fill: '#0000FF',
      width: '100%',
      height: '100%',
    };

    const range = {
      width: '30%',
      height: '10%',
      float: 'right'
    }

    const pieChart = {
      width: '75px',
      height: '75px'
    }

    const div = {
      visibility: "visible"
    }

    // var squareSize = {
    //   width: '30px',
    //   height: '30px',
    //    float: "right",
    //   // marginRight: "30px"
    // };

    var legend = {
      width: '125px',
      height: '30px',
      // float: "left",
      // marginRight: "40px"
    };

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
            <InfoWindow ref="InfoWindow" visible={this.state.infoWindowVisible} position={{ lat: this.state.infoWindowLat, lng: this.state.infoWindowLng }}>
              <div>
                Between {this.state.years[0]} and {this.state.years[1]} there have been {this.state.stateQuartiles.distribution_state[this.state.selectedState.toUpperCase()]} storms in {this.state.selectedState}
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
                  this.setState({ visibleMarkers: null });

                  // console.log(this.state.stateQuartiles.distribution_state[this.state.selectedState.toUpperCase()]);
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
            {this.state.visibleMarkers && this.state.visibleMarkers.map((storm) => {
              // console.log(storm);
              return (<Marker position={{ lat: storm.BEGIN_LAT, lng: storm.BEGIN_LON }}
                onClick={() => (console.log('woowee'))}></Marker>);
            })}
            {this.state.county_borders_list.map((county) => {
              if (this.state.selectedState === county.state) {
                return <CountyElement
                  paths={convertToLatLngArr(county.coordinates)}
                  onClick={(state) => {
                    // console.log(county.name.toUpperCase());
                    // console.log(this.state.stateQuartiles.distribution_county[(state.state).toUpperCase()])
                    // console.log(this.state.stateQuartiles.distribution_county[(state.state).toUpperCase()][county.name.toUpperCase()]);
                    this.setState({ visibleMarkers: this.state.stateQuartiles.distribution_county[(state.state).toUpperCase()][county.name.toUpperCase()] });
                  }
                  }
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
          <div >
            <PieChart
              viewBoxSize={20}
              data={data}
              // If you need expand on hover (or touch) effect

              // If you need custom behavior when sector is hovered (or touched)
              expandOnHover={true}
            />


          </div>

        </div>





      </div >

    );
  }
}



export const GoogleMaps = GoogleApiWrapper({
  apiKey: 'AIzaSyDRxBYiF5OC6YDFwVpctIeFjtHg5C7VEKI',
  libraries: ['visualization']
})(MapContainer);

export default MapContainer;