import React from 'react';
import counties from '../csv/counties.json';
import {CountyElement} from './County.js'


function generateCountyBorders() {
  var county_borders_list = [];

  for (var i = 0; i < counties.features.length; i++) {

    var county = counties.features[i];
    if (county.geometry.type === "MultiPolygon") {
      for (var j = 0; j < county.geometry.coordinates.length; j++) {
        county_borders_list.push({ 'coordinates': county.geometry.coordinates[j][0], 'name': county.properties.NAME, 'state': county.properties.STATE });
      }
    }
    else {
      county_borders_list.push({ 'coordinates': county.geometry.coordinates[0], 'name': county.properties.NAME, 'state': county.properties.STATE });
    }
  }


  const county_borders_arr = county_borders_list.map((county) =>
    <CountyElement
      paths={convertToLatLngArr(county.coordinates)}
      state={county.state}

    />

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



export default (generateCountyBorders);