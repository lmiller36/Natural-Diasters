import React, {
    Component
} from 'react';
<<<<<<< HEAD
import * as actions from '../redux/actions';
import { connect } from 'react-redux';
=======
import State from './State'
>>>>>>> 7abe8b72fd096027c67807d622297239bef8c2df
import data from '../csv/data_2018.json';
import states from '../csv/states.json';
import State from './State'
import Store from '../App'
import { Map, Marker, InfoWindow, Polygon, GoogleApiWrapper } from 'google-maps-react';
var R = 160, G = 0, B = 255;



function buildStateBorders(callbackClickedState) {

    var state_dist = {};
    for (var i = 0; i < data.length; i++) {
        var storm = data[i];
        var state = storm.STATE;
        if (state_dist[state] == null)
            state_dist[state] = 0;
        state_dist[state]++;
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

    const stateBorder = borders.map((border) =>
        <State
<<<<<<< HEAD
            onClick={
                () => (
                    callbackClickedState(border.state)
                 // this.props.updateSelectedState()
                )

            }
            //callbackClickedState={callbackClickedState}
            state={border.state}
            selectedState={window.selectedState}
=======
            onClick={() => (
                callbackClickedState(border.state)
            )}
            
>>>>>>> 7abe8b72fd096027c67807d622297239bef8c2df
            paths={convertToLatLngArr(border.border)}
            strokeColor={"#000000"}
            strokeOpacity={0.8}
            strokeWeight={2}
            fillColor={getFillColor(border.state, quartileDict, quartile_range)}
            fillOpacity={0.35}
        // onMouseover={
        //   () => (
        //     this.toggleInfoWindow(border.state)
        //   )
        // } 
        />

<<<<<<< HEAD
=======
        </State>
>>>>>>> 7abe8b72fd096027c67807d622297239bef8c2df
    );
    return stateBorder;
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

function convertToLatLngArr(arr) {
    var points = [];
    for (var i = 0; i < arr.length; i++) {
        var point = { lat: arr[i][1], lng: arr[i][0] };
        points.push(point);
    }

    return points;

}

function getTintValue(quartile, numQuartiles, originalValue) {
    var newTint = Math.round(originalValue + (255 - originalValue) * (quartile / numQuartiles));
    if (newTint == 256) newTint--;
    //console.log(newTint);
    return newTint.toString(16);
}

export default (buildStateBorders);