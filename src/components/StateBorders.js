import React from 'react';
import data2018 from '../csv/data_2018.json';
import states from '../csv/states.json';
import State from './State'
import counties from '../csv/counties.json';

var R = 160, G = 0, B = 255;

export class Quartiles {
    constructor(DataSet, quartile_range, isState) {
        this.DataSet = DataSet;
        this.quartile_range = quartile_range;
        this.countiesInStates = this.buildCountiesInState();
        this.distribution_state = this.buildStateDist()
        this.distribution_county = this.buildCountyDist();
        this.quartiles_state = this.mapStateDistToQuartileRanges();
        this.quartiles_county = this.mapCountyDistToQuartileRanges();
        console.log(this);
        //create dict in form {Texas:25 Alaska:12 ...}
    }
    buildCountiesInState() {
        const countiesDict = {}
        counties.features.forEach(county => {
            if (!countiesDict[county.properties.STATE.toUpperCase()])
                countiesDict[county.properties.STATE.toUpperCase()] = {};
            countiesDict[county.properties.STATE.toUpperCase()][(county.properties.NAME.toUpperCase())] = "Here";

        });
        //    console.log(countiesDict);
        return countiesDict;
    }
    //ADD NUM StoRmS per STATE
    buildCountyDist() {
        var missing = 0, found = 0;


        const distribution = {};
        data2018.forEach(dataPoint => {
            if (!distribution[dataPoint.STATE])
                distribution[dataPoint.STATE] = {};
            if (!distribution[dataPoint.STATE][dataPoint.CZ_NAME]) {
                // if (this.countiesInStates[dataPoint.STATE]) {
                //     if (this.countiesInStates[dataPoint.STATE][dataPoint.CZ_NAME]) {found++;}
                //     else {
                //         //console.log(dataPoint.STATE + " " + dataPoint.CZ_NAME);
                //         missing++;
                //     }
                // }
                distribution[dataPoint.STATE][dataPoint.CZ_NAME] = [];
            }
            distribution[dataPoint.STATE][dataPoint.CZ_NAME].push(dataPoint);
        });
        // console.log(distribution);

        //UPDATE ALL MISSIng DATA pts
        // var texasDataKeys = Object.keys(distribution.TEXAS);
        // for (var i = 0; i < texasDataKeys.length; i++) {
        //     if (this.countiesInStates['TEXAS'][texasDataKeys[i]]) found++;
        //     else console.log("Missing: " + texasDataKeys[i])
        // }
        // console.log(found);
        return distribution;
    }

    buildStateDist() {
        var state_dist = {};
        this.DataSet.forEach(dataPoint => {
            if (state_dist[dataPoint.STATE] == null)
                state_dist[dataPoint.STATE] = 0;
            state_dist[dataPoint.STATE]++;
        });
        return state_dist;
    }
    sortFunction(a, b) {
        var initialSort = a[1].length - b[1].length;
        if (initialSort != 0) return initialSort;
        return a[0].localeCompare(b[0]);
    }


    mapStateDistToQuartileRanges() {
        //create sorted list in form [[1,California],[3,Washington]...]
        var keys = Object.keys(this.distribution_state);
        var keyValArr = [];
        for (var i = 0; i < keys.length; i++) keyValArr.push([keys[i], this.distribution_state[keys[i]]]);
        keyValArr.sort(function (a, b) { return a[1] - b[1] });


        //Maps distribution of storms to quartiles(ranges of values) with each state's quartile being its value
        //creates dictionary in form {Texas:1 California:2 Alaska:2}
        var quartileDict = {};
        var curr = 0;
        var quartile_range = 10;
        var quartile = Math.trunc(keyValArr.length / this.quartile_range);
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
        return quartileDict;

    }
    mapStateDistToQuartileRangesTEST(stormsInEachCounty) {
        //create sorted list in form [[1,California],[3,Washington]...]
        var keys = Object.keys(stormsInEachCounty);
        stormsInEachCounty.sort((a, b) => { return this.sortFunction(a, b) });
        // console.log(stormsInEachCounty);

        //Maps distribution of storms to quartiles(ranges of values) with each state's quartile being its value
        //creates dictionary in form {Texas:1 California:2 Alaska:2}
        var quartileDict = {};
        var curr = 0;
        var quartile = Math.trunc(stormsInEachCounty.length / this.quartile_range);
        var currQuartile = 0;
        if (quartile == 0) {
            while (curr < stormsInEachCounty.length) {
                quartileDict[stormsInEachCounty[curr][0]] = [currQuartile, stormsInEachCounty[curr][1]];
                currQuartile++;
                curr++;
            }
            return quartileDict;
        }
        else
            while (curr < stormsInEachCounty.length) {
                if (stormsInEachCounty.length - curr >= quartile) {
                    for (var i = 0; i < quartile; i++) {

                        quartileDict[stormsInEachCounty[curr + i][0]] = [currQuartile, stormsInEachCounty[curr + i][1]];
                    }
                    currQuartile++;
                    curr += quartile;
                }
                else {
                    while (curr < stormsInEachCounty.length) {
                        quartileDict[stormsInEachCounty[curr][0]] = [currQuartile, stormsInEachCounty[curr][1]];
                        curr++;
                    }
                }

            }
        // console.log(quartileDict);
        return quartileDict;

    }

    mapCountyDistToQuartileRanges() {
        //create sorted list in form [[1,California],[3,Washington]...]
        var keysStates = Object.keys(this.distribution_county);
        // console.log(keysStates);
        var missingStates = {};
        var countyQuartiles = {};
        // var keyValArr = [];
        for (var i = 0; i < keysStates.length; i++) {
            // console.log(keysStates[i]);
            // console.log(this.distribution_county[keys[i]]);
            if (this.countiesInStates[keysStates[i]]) {

                //  console.log(keysStates[i]);
                var stateData = this.distribution_county[keysStates[i]];
                var keyValArr = [];
                var keysCounties = Object.keys(stateData);
                missingStates[keysStates[i]] = [];
                // console.log(keysCounties);
                keysCounties.forEach((county) => {
                    if (this.countiesInStates[keysStates[i]][county])
                        keyValArr.push([county, stateData[county]])
                    else
                        missingStates[keysStates[i]].push(county);
                });

                //console.log(keyValArr);
                countyQuartiles[keysStates[i]] = this.mapStateDistToQuartileRangesTEST(keyValArr);
            }
        }
        // console.log(countyQuartiles)
        // console.log(missingStates)
        this.missingCounties = missingStates;
        // keyValArr.push([keys[i], this.distribution_county[keys[i]]]);
        // keyValArr.sort();
        //console.log(keyValArr);

        //Maps distribution of storms to quartiles(ranges of values) with each state's quartile being its value
        //creates dictionary in form {Texas:1 California:2 Alaska:2}
        var quartileDict = {};
        // var curr = 0;
        // var quartile_range = 10;
        // var quartile = Math.trunc(keyValArr.length / this.quartile_range);
        // var currQuartile = 0;
        // while (curr < keyValArr.length) {
        //     if (keyValArr.length - curr >= quartile) {
        //         for (i = 0; i < quartile; i++) {

        //             quartileDict[keyValArr[curr + i][0]] = currQuartile;
        //         }
        //         currQuartile++;
        //         curr += quartile;
        //     }
        //     else {
        //         while (curr < keyValArr.length) {
        //             quartileDict[keyValArr[curr][0]] = currQuartile;
        //             curr++;
        //         }
        //     }

        // }
        return countyQuartiles;

    }
}

export function buildStateBorders() {

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


    return borders;
}

//determines color/tint based on quartile of given state
export function getFillColor(quartile, quartile_range, handleAsCounty) {
    if (handleAsCounty) {
        if (quartile)
            quartile = quartile[0];
        else
            quartile = 0;
    }
    else return "#000000"
    //var quartile = quartiles[state.toUpperCase()];
    return "#" + getTintValue(quartile, quartile_range, R) + getTintValue(quartile, quartile_range, G) + getTintValue(quartile, quartile_range, B);
}

//receives a list in the form [[-117,41],[-116,42]...] and converts to a list in the form [{lat:41 lng:41}...]
export function convertToLatLngArr(arr) {
    var points = [];
    for (var i = 0; i < arr.length; i++) {
        var point = { lat: arr[i][1], lng: arr[i][0] };
        points.push(point);
    }

    return points;

}

//receives which quarter of the data the value is in (ie fourth quartile ) and creates tint to match likelihood of data being present
export function getTintValue(quartile, numQuartiles, originalValue) {
    var newTint = Math.round(originalValue + (255 - originalValue) * (1 - quartile / numQuartiles));
    if (newTint == 256) newTint--;
    return newTint.toString(16);
}

export default (buildStateBorders);