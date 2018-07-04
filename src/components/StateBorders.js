import React from 'react';
import data from '../csv/data_2018.json';
import states from '../csv/states.json';
import State from './State'

var R = 160, G = 0, B = 255;



function buildStateBorders(callbackClickedState) {

    //create dict in form {Texas:25 Alaska:12 ...}
    var state_dist = {};
    data.forEach(storm => {
        if (state_dist[storm.STATE] == null)
            state_dist[storm.STATE] = 0;
        state_dist[storm.STATE]++;
    })

    //create sorted list in form [[1,California],[3,Washington]...]
    var keys = Object.keys(state_dist);
    var keyValArr = [];
    for (var i = 0; i < keys.length; i++) keyValArr.push([keys[i], state_dist[keys[i]]]);
    keyValArr.sort(function (a, b) { return a[1] - b[1] });


    //Maps distribution of storms to quartiles(ranges of values) with each state's quartile being its value
    //creates dictionary in form {Texas:1 California:2 Alaska:2}
    var quartileDict = {};
    var curr = 0;
    var quartile_range = 4;
    var quartile = Math.trunc(keyValArr.length / quartile_range);
    var currQuartile = 0;
    while (curr < keyValArr.length) {
        if (keyValArr.length - curr >= quartile) {
            for (i = 0; i < quartile; i++) {

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
    
    //creates a list of all borders provided (some states have multiple)
    const borders = [];
    states.features.forEach(state => {
        if (state.geometry.type == "MultiPolygon") {
            state.geometry.coordinates.forEach(border => {
                borders.push({ 'border': border[0], 'state': state.properties.NAME });
            });
        }
        else
            borders.push({ 'border': state.geometry.coordinates[0], 'state': state.properties.NAME });
    });



    const stateBorder = borders.map((border) =>
        <State
            state={border.state}
            selectedState={window.selectedState}
            onClick={() => (
                callbackClickedState(border.state)
            )}

            paths={convertToLatLngArr(border.border)}
            strokeColor={"#000000"}
            strokeOpacity={0.8}
            strokeWeight={2}
            fillColor={getFillColor(quartileDict[border.state.toUpperCase()], quartile_range)}
            fillOpacity={0.35}
        // onMouseover={
        //   () => (
        //     this.toggleInfoWindow(border.state)
        //   )
        // } 
        />

    );
    return stateBorder;
}

//determines color/tint based on quartile of given state
function getFillColor(quartile, quartile_range) {

    //var quartile = quartiles[state.toUpperCase()];
    return "#" + getTintValue(quartile, quartile_range, R) + getTintValue(quartile, quartile_range, G) + getTintValue(quartile, quartile_range, B);
}

//receives a list in the form [[-117,41],[-116,42]...] and converts to a list in the form [{lat:41 lng:41}...]
function convertToLatLngArr(arr) {
    var points = [];
    for (var i = 0; i < arr.length; i++) {
        var point = { lat: arr[i][1], lng: arr[i][0] };
        points.push(point);
    }

    return points;

}

//receives which quarter of the data the value is in (ie fourth quartile ) and creates tint to match likelihood of data being present
function getTintValue(quartile, numQuartiles, originalValue) {
    var newTint = Math.round(originalValue + (255 - originalValue) * (1 - quartile / numQuartiles));
    if (newTint == 256) newTint--;
    return newTint.toString(16);
}

export default (buildStateBorders);