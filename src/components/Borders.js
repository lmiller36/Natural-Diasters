import data2018 from '../csv/data_2018.json';
import states from '../csv/states.json';
import counties from '../csv/counties.json';
import keywordsToRemove from '../csv/keywordsToRemove';
// var R = 160, G = 0, B = 255;


//NOTE THAT SOME COUNTY NAMES ARE NOT FOUND SO POINT NOT INCLUDED IN COUNTY COLORS, BUT PRESENT IN STATE CALC


export class Quartiles {
    constructor(quartile_range, isState) {
        // this.DataSet = DataSet;
        this.quartile_range = quartile_range;
        this.keywordsRemovedForEachState = {};
        this.countiesInStates = this.buildCountiesInState();
        // this.distribution_state = this.buildStateDist()
        this.distribution_county = this.buildCountyDist();
        this.quartiles_state = this.mapStateDistToQuartileRanges();
        this.quartiles_county = this.mapCountyDistToQuartileRanges();

        //create dict in form {Texas:25 Alaska:12 ...}
    }
    buildCountiesInState() {
        const countiesDict = {}
        counties.features.forEach(county => {
            if (!countiesDict[county.properties.STATE.toUpperCase()])
                countiesDict[county.properties.STATE.toUpperCase()] = {};
            countiesDict[county.properties.STATE.toUpperCase()][(county.properties.NAME.toUpperCase())] = "Here";

        });
        return countiesDict;
    }

    //ADD NUM StoRmS per STATE
    buildCountyDist() {
        var missing = [], found = 0;


        const distribution = {};
        const dist_state = {}
        const mappedKeywords = {};
        data2018.forEach(dataPoint => {
            // if (dataPoint.STATE == "ALABAMA") console.log(dataPoint.CZ_NAME);
            var name = dataPoint.CZ_NAME;
            if (!distribution[dataPoint.STATE]) {
                distribution[dataPoint.STATE] = {};
                missing[dataPoint.STATE] = [];
                mappedKeywords[dataPoint.STATE] = {};
                dist_state[dataPoint.STATE] = 0;
            }
            if (!distribution[dataPoint.STATE][dataPoint.CZ_NAME]) {

                if (this.countiesInStates[dataPoint.STATE]) {

                    if (dataPoint.CZ_NAME && dataPoint.STATE) {
                        if (this.countiesInStates[dataPoint.STATE][dataPoint.CZ_NAME]) {
                            distribution[dataPoint.STATE][dataPoint.CZ_NAME] = [];
                        }
                        else if (this.countiesInStates[dataPoint.STATE][mappedKeywords[dataPoint.STATE][dataPoint.CZ_NAME]]) {
                            name = mappedKeywords[dataPoint.STATE][dataPoint.CZ_NAME];
                        }
                        else {
                            var newCountyName = this.findMissingCounty(dataPoint.CZ_NAME, dataPoint.STATE)
                            // if (dataPoint.STATE == "ALABAMA") console.log(":" + newCountyName + ": " + dataPoint.CZ_NAME);
                            if (this.countiesInStates[dataPoint.STATE][newCountyName]) {
                                name = newCountyName;
                                distribution[dataPoint.STATE][newCountyName] = [];
                                mappedKeywords[dataPoint.STATE][dataPoint.CZ_NAME] = newCountyName;
                                // StormsInEachCounty[countyName][1] = StormsInEachCounty[countyName][1].concat(stateData[county]);

                            }
                            else {
                                name = "MISSING"
                                missing[dataPoint.STATE].push(dataPoint);
                            }
                        }
                    }

                    // else found++;
                    // if (this.countiesInStates[dataPoint.STATE][dataPoint.CZ_NAME]) {found++;}
                    // else {
                    //     //console.log(dataPoint.STATE + " " + dataPoint.CZ_NAME);
                    //     missing++;
                    // }
                }

                //distribution[dataPoint.STATE][dataPoint.CZ_NAME] = [];
            }
            dist_state[dataPoint.STATE]++;
            if (distribution[dataPoint.STATE][name])
                distribution[dataPoint.STATE][name].push(dataPoint);
        });
        console.log(missing);
        this.missing = missing;
        //   console.log(missing + " " + found);
        this.distribution_state = dist_state;
        return distribution;
    }

    // buildStateDist() {
    //     var state_dist = {};
    //     var stormTypes = {}
    //     data2018.forEach(dataPoint => {
    //         if (state_dist[dataPoint.STATE] == null)
    //             state_dist[dataPoint.STATE] = 0;
    //         if (!stormTypes[dataPoint.EVENT_TYPE]) stormTypes[dataPoint.EVENT_TYPE] = "present";
    //         state_dist[dataPoint.STATE]++;
    //     });

    //     this.stormTypes = stormTypes;

    //     return state_dist;
    // }

    sortFunction(a, b) {
        var initialSort = a[1].length - b[1].length;
        if (initialSort !== 0) return initialSort;
        return a[0].localeCompare(b[0]);
    }

    mapStateDistToQuartileRanges() {
        //create sorted list in form [[1,California],[3,Washington]...]
        var keys = Object.keys(this.distribution_state);
        var StormsInEachCounty = [];
        for (var i = 0; i < keys.length; i++) StormsInEachCounty.push([keys[i], this.distribution_state[keys[i]]]);
        StormsInEachCounty.sort(function (a, b) { return a[1] - b[1] });


        //Maps distribution of storms to quartiles(ranges of values) with each state's quartile being its value
        //creates dictionary in form {Texas:1 California:2 Alaska:2}
        var quartileDict = {};
        var curr = 0;
        var quartile_range = 10;
        var quartile = Math.trunc(StormsInEachCounty.length / this.quartile_range);
        var currQuartile = 0;
        while (curr < StormsInEachCounty.length) {
            if (StormsInEachCounty.length - curr >= quartile) {
                for (i = 0; i < quartile; i++) {

                    quartileDict[StormsInEachCounty[curr + i][0]] = currQuartile;
                }
                currQuartile++;
                curr += quartile;
            }
            else {
                while (curr < StormsInEachCounty.length) {
                    quartileDict[StormsInEachCounty[curr][0]] = currQuartile;
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
        if (quartile === 0) {
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
        //        for (var i = 0; i < keysStates.length; i++) {

        for (var i = 0; i < keysStates.length; i++) {
            this.keywordsRemovedForEachState[keysStates[i]] = {};
            if (this.countiesInStates[keysStates[i]]) {

                var stateData = this.distribution_county[keysStates[i]];
                var StormsInEachCounty = [];
                var keysCounties = Object.keys(stateData);
                missingStates[keysStates[i]] = [];
                keysCounties.forEach((county) => {
                    var countyName = county;
                    // StormsInEachCounty[county] = [county, stateData[county]];
                    if (!this.countiesInStates[keysStates[i]][county]) {
                        var newCountyName = this.findMissingCounty(county, keysStates[i]);
                        if (!this.countiesInStates[keysStates[i]][newCountyName]) {
                            missingStates[keysStates[i]].push(county);
                            return;
                        }
                        else {
                            // else
                            // console.log("FOUND " + newCountyName + " in " + keysStates[i]);
                            countyName = newCountyName;
                        }
                    }

                    //repeat county name
                    if (StormsInEachCounty[countyName]) {
                        // console.log('before');
                        StormsInEachCounty[countyName][1] = StormsInEachCounty[countyName][1].concat(stateData[county]);
                        // console.log(stateData[county]);
                        // console.log(StormsInEachCounty[countyName]);
                    }
                    else
                        StormsInEachCounty[countyName] = [countyName, stateData[county]]

                    // else {
                    //     var newCountyName = this.findMissingCounty(county, keysStates[i]);
                    //     if (StormsInEachCounty[newCountyName]) console.log(newCountyName + " has already been used");
                    //     // if (this.countiesInStates[keysStates[i]][newCountyName]) {

                    //     //     StormsInEachCounty.push([county, stateData[newCountyName]]);
                    //     //     console.log(newCountyName + " has been appended");
                    //     // }
                    //     // else
                    //     //     //FIX SO THESE ARE ADDED AND THE WORK IS NOT REDONE
                    //     //     missingStates[keysStates[i]].push(county);
                    // }
                });
                // console.log(keysStates[i]);
                // console.log(StormsInEachCounty);
                countyQuartiles[keysStates[i]] = this.mapStateDistToQuartileRangesTEST(Object.values(StormsInEachCounty));
            }
        }

        this.missingCounties = missingStates;
        console.log(missingStates);
        // console.log(this.keywordsRemovedForEachState);
        // console.log(JSON.stringify(this.keywordsRemovedForEachState));
        return countyQuartiles;

    }

    //Some of the data has county names surrounded by gibberish. This method seeks to have more datapoints included 
    //which is accomplished by parsing out gibberish words(such as Eastern or Northern)
    //#TODO REPLACE WITH REGEX
    findMissingCounty(CountyName, State) {
        var newCountyName = CountyName;
        var wordsToSplitBy = Object.keys(keywordsToRemove[State]);
        //['EASTERN', 'WESTERN', 'SOUTHERN', 'NORTHERN', 'NORTH', 'SOUTH', 'EAST', "WEST", 'NORTHWEST', "SOUTHEAST", "COASTAL", "COUNTY", "LOWER", "BASIN", "MOUNTAINS SOUTH OF I-80", "MOUNTAIN VALLEYS", "INLAND", "CENTRAL", "METRO AREA", "WINDWARD", "LEEWARD", "AREA", "GAP", "UPPER", "(BROOKLYN)", "(MANHATTAN)", "(STATEN IS.)", "MOUNTAINS"];
        wordsToSplitBy.forEach(word => {
            if (newCountyName.indexOf(word) != -1) {
                // this.keywordsRemovedForEachState[State][word] = CountyName;
                //CountyName = CountyName.split(word)[0];
                // console.log(CountyName);
                var split = newCountyName.split(word);
                // if (State == "ALABAMA") console.log(split);
                if (split[0]) {
                    newCountyName = split[0].trim();
                }
                else if (split[1]) {
                    newCountyName = split[1].trim();
                }

                if (this.countiesInStates[State][newCountyName]) {

                    //console.log("FOUND from keywords: " + State + " " + newCountyName);
                    return newCountyName;
                }

                //     console.log(word+" "+CountyName+" "+State);
                //    console.log(this.countiesInStates[State]);
            }
        });

        //still not found
        if (State.toUpperCase() == "ALABAMA") {
            console.log(CountyName + " " + State + " " + newCountyName);
            console.log(wordsToSplitBy);
        }
        if (newCountyName == CountyName) {
            newCountyName = CountyName.replace(/\s/g, '');
            //console.log(newCountyName);
            if (this.countiesInStates[State][newCountyName])
                return newCountyName;
            else
                return null;
            // var split = newCountyName.split(" ");
            // split.forEach(word => {

            //     if (this.countiesInStates[State][word]) {
            //         // for (var i = 0; i < split.length; i++)
            //         //     if (split[i] != word) this.keywordsRemovedForEachState[State][split[i]] = CountyName;

            //         console.log(word + " in " + CountyName + ", " + State);
            //         return;
            //     }
            // });
            //console.log("NOT FOUND: " + State + " " + CountyName);
        }
        // console.log(newCountyName);
        return newCountyName;
    }
}



export class Borders {
    constructor() {
        this.county_borders_list = this.generateCountyBorders();
        this.generateStateBorders();
    }

    generateCountyBorders() {

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

        return county_borders_list;
    }

    generateStateBorders() {
        //creates a list of all borders provided (some states have multiple)

        var boundsBoxes = {};

        const borders = [];
        states.features.forEach(state => {
            var bounds = new window.google.maps.LatLngBounds();
            if (state.geometry.type === "MultiPolygon") {
                state.geometry.coordinates.forEach(border => {
                    borders.push({ 'border': border[0], 'state': state.properties.NAME });
                    border[0].forEach(datapoint => {
                        bounds.extend(new window.google.maps.LatLng(datapoint[1], datapoint[0]));
                    }
                    )
                });
            }
            else {
                borders.push({ 'border': state.geometry.coordinates[0], 'state': state.properties.NAME });
                state.geometry.coordinates[0].forEach(datapoint => {
                    bounds.extend(new window.google.maps.LatLng(datapoint[1], datapoint[0]));
                });
            }

            boundsBoxes[state.properties.NAME] = bounds.toJSON(); //[bounds.getNorthEast().toJSON(),bounds.getSouthWest().toJSON()];
        });
        this.boundsBoxes = boundsBoxes;
        this.state_borders_list = borders;
        //return [borders, boundsBoxes];
    }

}


//determines color/tint based on quartile of given state
export function getFillColor(quartile, quartile_range, handleAsCounty, RGB) {
    if (handleAsCounty) {
        if (quartile)
            quartile = quartile[0];
        else
            quartile = 0;
    }
    //var quartile = quartiles[state.toUpperCase()];
    const color = "#" + getTintValue(quartile, quartile_range, RGB[0]) + getTintValue(quartile, quartile_range, RGB[1]) + getTintValue(quartile, quartile_range, RGB[2]);
    // console.log(color);
    return color;
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
    var newTint = Math.round(originalValue + (255 - originalValue) * (1 - ((quartile + 1) / (numQuartiles + 1))));
    if (newTint === 256) newTint--;
    return newTint.toString(16);
}

export default (Borders);