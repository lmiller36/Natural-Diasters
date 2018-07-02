import React, {
  Component
} from 'react';
import counties from '../csv/counties.json';
import { Map, Marker, InfoWindow, Polygon, GoogleApiWrapper } from 'google-maps-react';
var selectedState = "California";
function generateCountyBorders() {
  var county_borders_list = [];

  for (var i = 0; i < counties.features.length; i++) {

    var county = counties.features[i];
    if (county.geometry.type == "MultiPolygon") {
      for (var j = 0; j < county.geometry.coordinates.length; j++) {
        county_borders_list.push({ 'coordinates': county.geometry.coordinates[j][0], 'name': county.properties.NAME, 'state': county.properties.STATE });
      }
    }
    else {
      //();
      county_borders_list.push({ 'coordinates': county.geometry.coordinates[0], 'name': county.properties.NAME, 'state': county.properties.STATE });
    }
  }

  const style = { display: 'none' }

  const county_borders_arr = county_borders_list.map((county) =>
    <Polygon2
      // visible={county.state == selectedState ? true : false}
      // className={style}
      paths={convertToLatLngArr(county.coordinates)}
    //   strokeColor={"#000000"}
    //   strokeOpacity={0.8}
    //   strokeWeight={2}
    //   fillColor={"0000FF"}
    //   fillOpacity={0.35}
     >

    </Polygon2>
  );
  return county_borders_arr;
}

function convertToLatLngArr(arr) {
  var points = [];
  for (var i = 0; i < arr.length; i++) {
    var point = { lat: arr[i][1], lng: arr[i][0] };
    points.push(point);
  }

  return points;

}
function getStyle(state) {
  // console.log(state);
  //var visible = state == selectedState ? "hidden" : "visible";  
  return { visibility: 'hidden' };

}

class Polygon2 extends Polygon {
  constructor(props) {
    super(props);
    this.paths = props.paths;
  }
  render() {
    return <Polygon
      visible={true}
      paths={this.paths}
      strokeColor={"#000000"}
      strokeOpacity={0.8}
      strokeWeight={2}
      fillColor={"0000FF"}
      fillOpacity={0.35}
    />
  }

}

export default (generateCountyBorders);