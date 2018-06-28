import React, {
  Component
} from 'react';
import './App.css';
import data from './data_2018.json';
import states from './states.json';
import stateCenters from './state_centers.json';

// import ReactDOM from 'react-dom'
import { Map, Marker, InfoWindow, Polygon, GoogleApiWrapper } from 'google-maps-react';

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

//determines color/tint based on quartile of given state
function getFillColor(state, quartiles, quartile_range) {

  var num = quartiles[state.toUpperCase()];
  var tint = (256 * (quartile_range - num) / quartile_range);
  if (tint == 256) tint--;
  tint = tint.toString(16);
  if (tint.length < 2) tint = "0" + tint;

  var blues = ["#9999ea", "#6e6ed4", "#3f3fd8", "#0000FF"]
  return "#" + tint + tint + "FF";
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

  render() {
    const style = {
      width: '50%',
      height: '50%'
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

    return (
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

          {state_borders}
        </Map>
      </div>
    );

  }
}


export default GoogleApiWrapper({
  apiKey: 'AIzaSyDRxBYiF5OC6YDFwVpctIeFjtHg5C7VEKI',
  libraries: ['visualization']
})(MapContainer);

