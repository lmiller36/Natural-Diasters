import React, {
  Component
} from 'react';
import counties from '../csv/counties.json';
import { connect } from 'react-redux';

import { Map, Marker, InfoWindow, Polygon, GoogleApiWrapper } from 'google-maps-react';
// import {CountyElement} from './County';
var selectedState = "California";

class County extends Polygon {
  constructor(props) {
    super(props);
    //  this.paths = props.paths;
    this.state = {
      myState: props.state
    };
  }

  // render() {
  //  return this.renderPolygon();
  // }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.selectedState !== prevProps.selectedState && this.props.selectedState == this.state.myState) {
      this.renderPolygon();
    }
  }

  renderPolygon() {
    //console.log(this.props.selectedState + " " + this.state.myState);
    //var isVisible = this.props.selectedState == this.state.myState;
    if (this.props.selectedState == this.state.myState) {
      return super.renderPolygon();
    }
    else return null;

    //else return (<div/>);
    // return <Polygon
    //   visible={isVisible}
    //   paths={this.paths}
    //   strokeColor={"#000000"}
    //   strokeOpacity={0.8}
    //   strokeWeight={2}
    //   fillColor={"0000FF"}
    //   fillOpacity={0.35}
    // />
  }

}

const mapStateToProps = (state) => ({
  selectedState: state.selectedState
});

const mapDispatchToProps = (dispatch) => ({

});
const CountyElement = connect(mapStateToProps)(County);

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
    <CountyElement
      // visible={county.state == selectedState ? true : false}
      // className={style}
      paths={convertToLatLngArr(county.coordinates)}
      state={county.state}
    //   strokeColor={"#000000"}
    //   strokeOpacity={0.8}
    //   strokeWeight={2}
    //   fillColor={"0000FF"}
    //   fillOpacity={0.35}
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