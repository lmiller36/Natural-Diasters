import React, {
  Component
} from 'react';
import './App.css';
import data2 from './csv/data_2017.json';
import data from './csv/data_2018.json';
import counties from './csv/counties.json';
import states from './csv/states.json';
import stateCenters from './csv/state_centers.json';
import { Map, Marker, InfoWindow, Polygon, GoogleApiWrapper } from 'google-maps-react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { ifError } from 'assert';

var R = 160, G = 0, B = 255;
function parseYearMonth(yearMonth) {
  var year = (yearMonth + '').substring(0, 4);
  var monthNum = (yearMonth + '').substring(5);
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var month = months[parseInt(monthNum)];
  //console.log(month + ", " + year);
  return month + "," + year;
}

function convertToLatLngArr(arr) {
  var points = [];
  for (var i = 0; i < arr.length; i++) {
    var point = { lat: arr[i][1], lng: arr[i][0] };
    points.push(point);
  }

  return points;

}




function getMoviesFromApiAsync() {
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

function getTintValue(quartile, numQuartiles, originalValue) {
  var newTint = Math.round(originalValue + (255 - originalValue) * (quartile / numQuartiles));
  if (newTint == 256) newTint--;
  //console.log(newTint);
  return newTint.toString(16);
}

//determines color/tint based on quartile of given state
function getFillColor(state, quartiles, quartile_range) {

  var quartile = quartiles[state.toUpperCase()];
  // var tint = (256 * (quartile_range - num) / quartile_range);
  // if (tint == 256) tint--;
  // tint = tint.toString(16);
  // if (tint.length < 2) tint = "0" + tint;

  //var blues = ["#9999ea", "#6e6ed4", "#3f3fd8", "#0000FF"]
  return "#" + getTintValue(quartile, quartile_range, R) + getTintValue(quartile, quartile_range, G) + getTintValue(quartile, quartile_range, B);
}

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { isVisible: false, infoWindowLat: 41, infoWindowLng: -116, state: "" };
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
      width: '50%',
      height: '50%'
    }

    const range = {
      width: '30%',
      height: '10%',
      float: "right",
    }

    var state_dist = {};
    for (var i = 0; i < data.length; i++) {
      var storm = data[i];
      var state = storm.STATE;
      if (state_dist[state] == null)
        state_dist[state] = 0;
      state_dist[state]++;
    }

    const borders = [];

    //creates a list of all borders provided (some states have multiple)
    for (var i = 0; i < states.features.length; i++) {
      var state = states.features[i];
      if (state.geometry.type == "MultiPolygon") {
        var tempArr = state.geometry.coordinates;
        for (var j = 0; j < tempArr.length; j++) {
          borders.push({ 'border': tempArr[j][0], 'state': state.properties.NAME });
        }
      }
      else
        borders.push({ 'border': state.geometry.coordinates[0], 'state': state.properties.NAME });
    }



    var keys = Object.keys(state_dist);
    var keyValArr = [];
    for (var i = 0; i < keys.length; i++) keyValArr.push([keys[i], state_dist[keys[i]]]);
    keyValArr.sort(function (a, b) { return a[1] - b[1] });


    //Maps distribution of storms to quartiles(ranges of values)
    var quartileDict = {};
    var curr = 0;
    var quartile_range = 4;
    var quartile = Math.trunc(keyValArr.length / quartile_range);
    var currQuartile = 0;
    while (curr < keyValArr.length) {
      if (keyValArr.length - curr >= quartile) {
        for (var i = 0; i < quartile; i++) {

          quartileDict[keyValArr[curr + i][0]] = currQuartile;
        }
        currQuartile++;
        curr += quartile;
      }
      else {
        while (curr < keyValArr.length) {
          quartileDict[keyValArr[curr][0]] = currQuartile;
          curr++;
        }
      }

    }

    const state_borders = borders.map((border) =>
      <Polygon
        onClick={() => (
          this.toggleInfoWindow(border.state)
        )}
        paths={convertToLatLngArr(border.border)}
        strokeColor={"#000000"}
        strokeOpacity={0.8}
        strokeWeight={2}
        fillColor={getFillColor(border.state, quartileDict, quartile_range)}
        fillOpacity={0.35}
        onMouseover={
          () => (
            this.toggleInfoWindow(border.state)
          )
        } >

      </Polygon>
    );

    var county_borders_list = [];
    //console.log(counties);
    //
    for (var i = 0; i < counties.features.length; i++) {

      var county = counties.features[i];
      if (county.geometry.type == "MultiPolygon") {
        for (var j = 0; j < county.geometry.coordinates.length; j++) {
          county_borders_list.push(county.geometry.coordinates[j][0]);
         // console.log(county.geometry.coordinates);
        }
      }
      else {
       // console.log(county.geometry.coordinates);
        county_borders_list.push(county.geometry.coordinates[0]);
      }
    }

   // console.log(county_borders_list);

    const county_borders_arr = county_borders_list.map((county) =>
      <Polygon
        // onClick={() => (
        //   this.toggleInfoWindow(border.state)
        // )}
        paths={convertToLatLngArr(county)}
        strokeColor={"#000000"}
        strokeOpacity={0.8}
        strokeWeight={2}
        fillColor={"0000FF"}
        fillOpacity={0.35}
      // onMouseover={
      //   () => (
      //     this.toggleInfoWindow(border.state)
      //   )
      // } 
      >

      </Polygon>
    );
   // console.log(county_borders_arr);

    var squareSize = {
      width: '30px',
      height: '30px',
      float: "left",
      marginRight: "40px"
    };

    var slider = {
      marginLeft: "40px",
      marginTop: "7px",
      width: '90%'
    };

    var hasLat = [];
    for (var i = 0; i < data.length; i++) {
      var index = data[i];
      if (index.BEGIN_LAT != "") {
        hasLat.push(index);
      }
    }
    //console.log(hasLat[0].END_LON);

    // const listItems = hasLat.map((list) =>
    //   <Marker
    //     position={{ lat: list.ENDLAT, lng: list.ENDLON }}></Marker>
    // );

    // const listItems = data2.map((list) =>
    //   <Marker title={parseYearMonth(list.YEARMONTH)}
    //     position={{ lat: list.LATITUDE, lng: list.LONGITUDE }}></Marker>


    // );

    //  console.log(listItems);


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

            <InfoWindow visible={true} position={{ lat: this.state.infoWindowLat, lng: this.state.infoWindowLng }}>
              <div>
                {this.buildComponent(state_dist[this.state.state.toUpperCase()], this.state.state)}
              </div>
            </InfoWindow>
            {/* {listItems} */}
            {state_borders}
            {/* {county_borders_arr} */}
          </Map>

        </div>
        <div style={range}>
          <CustomizedSlider onUpdate={(value) => (this.handleSliderChange(value))} />
        </div>

      </div>
    );

  }
}

class CustomizedSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 255,
      R: 0,
      G: 0,
      B: 255
    };
    this.callbackValue = props.onUpdate;

  }
  onRangeChange = (value) => {
    this.setState({ R: Math.round(256 * (value[1] - value[0]) / 99) });
    this.setState({ G: Math.round(256 * (value[2] - value[1]) / 99) });
    this.setState({ B: Math.round(256 * (value[3] - value[2]) / 99) });
  }

  onAfterChange = (value) => {
    // console.log(value); //eslint-disable-line
    this.callbackValue(value);
  }

  ensureLengthTwo(num) {
    var str = num.toString(16) + "";
    if (str.length < 2) str = "0" + str;
    if (str.length > 2) str = "FF"
    return str;
  }

  render() {
    var squareSize = {
      width: '30px',
      height: '30px',
      float: "left",
      marginRight: "40px"
    };

    var slider = {
      marginLeft: "40px",
      marginTop: "9px",
      width: '90%'
    };


    var backgroundColor = "#"
      + this.ensureLengthTwo(this.state.R)
      + this.ensureLengthTwo(this.state.G)
      + this.ensureLengthTwo(this.state.B);

    var style = {
      fill: backgroundColor,
      width: '100%',
      height: '100%',
    };


    //var square = <ColorSquare R={this.state.R} G={this.state.G} B={this.state.B} />


    return (

      <div>
        <div style={squareSize}>
          <svg style={{ fill: "#" + this.ensureLengthTwo(this.state.R) + this.ensureLengthTwo(this.state.G) + this.ensureLengthTwo(this.state.B), width: '100%', height: '100%' }}>
            <rect style={style} />
          </svg>
        </div>
        <div style={slider}>
          <Range count={4} defaultValue={[10, 20, 30, 80]} pushable={0} onChange={this.onRangeChange} onAfterChange={this.onAfterChange} min={1} max={99}
            trackStyle={[{ backgroundColor: 'red' }, { backgroundColor: 'green' }]}
            handleStyle={[{ backgroundColor: 'yellow' }, { backgroundColor: 'gray' }]}
            railStyle={{ backgroundColor: 'black' }}
          />
        </div>
      </div>
    );
  }
}


class ColorSquare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      R: props.R,
      G: props.G,
      B: props.B
    };
    //this.updateRGB = this.updateRGB.bind(this);
  }

  // updateRGB(newR, newG, newB) {
  //   this.setState({ R: newR });
  //   this.setState({ G: newG });
  //   this.setState({ B: newB });
  // }

  ensureLengthTwo(num) {
    var str = num.toString(16) + "";
    if (str.length < 2) str = "0" + str;
    if (str.length > 2) str = "FF"
    return str;
  }

  render() {



    var backgroundColor = "#"
      + this.ensureLengthTwo(this.state.R)
      + this.ensureLengthTwo(this.state.G)
      + this.ensureLengthTwo(this.state.B);
    console.log(backgroundColor)
    var style = {
      fill: backgroundColor,
      width: '100%',
      height: '100%',
    };

    return (
      <svg style={style}>
        <rect style={style} />
      </svg>
    );
    // <div
    //   style={style}
    // />
  }

}


export default GoogleApiWrapper({
  apiKey: 'AIzaSyDRxBYiF5OC6YDFwVpctIeFjtHg5C7VEKI',
  libraries: ['visualization']
})(MapContainer);

