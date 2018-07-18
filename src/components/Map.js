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
      queriedRegion: "USA",
      stormsInQueriedRegion: 10,
      stateQuartiles: new Quartiles(4, true),
      boundsBoxes: BordersObj.boundsBoxes,
      state_borders_list: BordersObj.state_borders_list,
      county_borders_list: BordersObj.county_borders_list,
      RGB: [0, 0, 255],
      years: [2017, 2018],
      visibleMarkers: null,
      pieChartData: [
        { title: "Data 1", value: 100, color: "#FF00FF" },
        { title: "Data 2", value: 60, color: "#820e91" },
        { title: "Data 3", value: 30, color: "#91230d" },
        { title: "Data 4", value: 20, color: "#177519" },
        { title: "Data 5", value: 10, color: "#a1d9ce" },
      ]

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

  getImage(stormType) {
    const image_urls = {
      "Drought": "https://d30y9cdsu7xlg0.cloudfront.net/png/253282-200.png",
      "Flood": "https://d30y9cdsu7xlg0.cloudfront.net/png/752-200.png",
      "Hail": "https://cdn4.iconfinder.com/data/icons/heavy-weather/100/Weather_Icons_05_hail-512.png",
      "Other": "https://cdn3.iconfinder.com/data/icons/weather-16/256/Storm-512.png",
      "Thunderstorm": "https://cdn3.iconfinder.com/data/icons/weather-58/50/cloud-512.png",
      "Tornado": "https://d30y9cdsu7xlg0.cloudfront.net/png/10261-200.png",
      "Water Storms": "https://cdn4.iconfinder.com/data/icons/aami-web-internet/64/aami17-90-512.png",
      "Wildfire": "https://cdn4.iconfinder.com/data/icons/natural-disaster/90/Natural_disaster-04-512.png",
      "Wind": "https://www.shareicon.net/data/256x256/2015/10/02/110393_weather_512x512.png",
      "Winter": "https://png.icons8.com/wired/2x/snow-storm.png"
    }
    return image_urls[stormType];
  }

  handleKeyDown(e) {
    const resetKey = "KeyR";
    if (e.code === resetKey) {
      console.log("reset screen");
      this.refs.mapElement.map.setZoom(initialZoom);
      this.refs.mapElement.map.setCenter(initCenter);
      this.setState({ infoWindowVisible: false });
      this.setState({ selectedState: "" });
      this.setState({ queriedRegion: "USA" });
      this.setState({ stormsInQueriedRegion: this.state.stateQuartiles.queriableRegion.rangeData.USA["2018"].total });
      this.setState({ pieChartData: this.state.stateQuartiles.queriableRegion.rangeData.USA["2018"].pieChartData });
      this.setState({ visibleMarkers: null });

    }
  }

  componentWillMount() {

    document.addEventListener("keydown", (e) => (this.handleKeyDown(e)));
  }

  componentDidMount() {

    // var legend = 
    this.refs.mapElement.map.controls[this.props.google.maps.ControlPosition.RIGHT_BOTTOM].push(this.refs.legend);
    this.setState({ stormsInQueriedRegion: this.state.stateQuartiles.queriableRegion.rangeData.USA["2018"].total });
    this.setState({ pieChartData: this.state.stateQuartiles.queriableRegion.rangeData.USA["2018"].pieChartData });

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
                hi
                {/* Between {this.state.years[0]} and {this.state.years[1]} there have been {this.state.stormsInQueriedRegion} storms in {this.state.selectedState} */}
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
                  this.setState({ queriedRegion: border.state });
                  this.setState({ stormsInQueriedRegion: this.state.stateQuartiles.distribution_state[this.state.selectedState.toUpperCase()].length });
                  this.setState({ visibleMarkers: null });
                  // console.log(this.state.stateQuartiles.distribution_state[border.state.toUpperCase()]);
                  this.state.stateQuartiles.queriableRegion.addRegion(border.state, "2018", this.state.stateQuartiles.distribution_state[border.state.toUpperCase()], true);
                  this.setState({ pieChartData: this.state.stateQuartiles.queriableRegion.rangeData[border.state]["2018"].pieChartData });

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
          <div style={{ width: '75px', border: '1px solid #000000', background: "#FFFFFF", float: "right", cursor: "pointer" }}>

            {this.state.pieChartData.map(stormType => {
              if (stormType.value)
                return (<div style={{ width: '65px', height: '30px', float: "left", marginTop: "2px" }}>
                  <svg style={{ fill: stormType.color, width: '30px', height: '30px' }}>
                    <rect style={{ fill: stormType.color, width: '30px', height: '30px', }} />
                  </svg>
                  <img src={this.getImage(stormType.title)} width='29px' height='30px' float="right" border="1" style={{ marginLeft: "4px" }} />
                </div>
                );
            })}
            {/* <div style={{ width: '75px', height: '120px', border: '1px solid #000000', background: "#FFFFFF", float: "right", cursor: "pointer" }}>
            <div style={{ width: '65px', height: '30px', float: "left", marginTop: "2px" }}>
              <svg style={{ fill: '#3333ff', width: '30px', height: '100%' }}>
                <rect style={{ fill: '#3333ff', width: '30px', height: '100%', }} />
              </svg>
              <img src="https://png.icons8.com/wired/2x/snow-storm.png" width='29px' height='30px' float="right" border="1" style={{marginLeft: "7px"}} />
            </div>
            <div style={{ width: '65px', height: '30px', float: "left", marginTop: "4px" }}>
              <svg style={{ fill: '#3333ff', width: '30px', height: '100%' }}>
                <rect style={{ fill: '#3333ff', width: '30px', height: '100%', }} />
              </svg>
              <img src="https://png.icons8.com/wired/2x/snow-storm.png" width='29px' height='30px' float="right" border="1" />
            </div> */}
          </div>

          <div style={{ float: "top" }}>
            Between {this.state.years[0]} and {this.state.years[1]} there have been {this.state.stormsInQueriedRegion} storms in {this.state.queriedRegion}
          </div  >
          <div style={{ width: '350px', height: '350px', float: "left" }}>
            <PieChart
              data={this.state.pieChartData}
              // If you need expand on hover (or touch) effect

              // If you need custom behavior when sector is hovered (or touched)
              expandOnHover={true}
            />
          </div>



          <div style={{  marginTop: "400px" }}>
            <CustomizedSlider onUpdate={(value) => { this.setState({ RGB: value }) }} />
            <br />
            <br />
            <Range ref="yearRange" count={2} defaultValue={[2017, 2018]} pushable={0} onUpdate={(value) => { this.setState({ years: value }) }} onAfterChange={() => (console.log('finito'))} min={1950} max={2018}
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



          {/* <div style={{ textAlign: 'left', marginLeft: '15px' }}>
              2 storms*/}
        </div>
        <div ref="legend" style={{ width: '120px', height: '60px', border: '1px solid #000000', background: "#FFFFFF", float: "left", cursor: "pointer" }}>
          <div style={{ float: "center", textAlign: 'center' }}>
            Legend
            </div>
          <div onClick={() => (console.log('just checking1'))} style={{ width: '30px', height: '30px', float: "left", }}>
            <svg style={{ fill: '#3333ff', width: '100%', height: '100%' }}>
              <rect style={{ fill: '#3333ff', width: '100%', height: '100%', }} />
            </svg>
          </div>
          <div onClick={() => (console.log('just checking3'))} style={{ width: '30px', height: '30px', float: "left", }}>
            <svg style={{ fill: '#6666ff', width: '100%', height: '100%' }}>
              <rect style={{ fill: '#6666ff', width: '100%', height: '100%', }} />
            </svg>
          </div>
          <div onClick={() => (console.log('just checking2'))} style={{ width: '30px', height: '30px', float: "left", }}>
            <svg style={{ fill: '#9999ff', width: '100%', height: '100%' }}>
              <rect style={{ fill: '#9999ff', width: '100%', height: '100%', }} />
            </svg>
          </div>
          <div onClick={() => (console.log('just checking4'))} style={{ width: '30px', height: '30px', float: "left", }}>
            <svg style={{ fill: '#ccccff', width: '100%', height: '100%' }}>
              <rect style={{ fill: '#ccccff', width: '100%', height: '100%', }} />
            </svg>
          </div>
          <br />
          <br />



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