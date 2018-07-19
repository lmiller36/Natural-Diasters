import data2018 from '../csv/data_2018.json';
import states from '../csv/states.json';
import counties from '../csv/counties.json';
import stormTypes from '../csv/categories.json'
import keywordsToRemove from '../csv/keywordsToRemove';
import QueriableRegions from './QueriableRegions.js';
// var R = 160, G = 0, B = 255;


//NOTE THAT SOME COUNTY NAMES ARE NOT FOUND SO POINT NOT INCLUDED IN COUNTY COLORS, BUT PRESENT IN STATE CALC


/**
 * This class creates several different objects that are used in the main application
 */
export class Quartiles {
    constructor(quartile_range, isState) {
        this.quartile_range = quartile_range;
        this.keywordsRemovedForEachState = {};
        this.countiesInStates = this.buildCountiesInState();
        this.stormsInEachCounty = this.buildStormsInEachCounty();
        this.quartiles_state = this.mapStateDistToQuartileRanges();
        this.quartiles_county = this.createCountyDistributions();

        //create dict in form {Texas:25 Alaska:12 ...}
    }


    /**
     * Creates a dictionary with the counties found in each each
     * {
     *      California: {  Marin: here ...   }
     *      Illinois:   {  Cook: here  ...   }
     *      ...
     * }
     */
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
    buildStormsInEachCounty() {
        var missing = [];
        const distribution = {}, distributionOfStormsInEachState = {}, mappedKeywords = {}, stormDistUSA = {};

        //makes dictionary with keys reflecting the types of storms with a count value
        //{"Winter": 10 Thunderstorms:7 ...}
        stormTypes.categories.forEach(stormType => {
            stormDistUSA[stormType] = 0;
        });

        //Iterates through all datapoints
        data2018.forEach(datapoint => {
            var name = datapoint.CZ_NAME;

            //checks if the datapoint's state already exists in the distribution dictionary
            if (!distribution[datapoint.STATE]) {
                distribution[datapoint.STATE] = {};
                missing[datapoint.STATE] = [];
                mappedKeywords[datapoint.STATE] = {};
                distributionOfStormsInEachState[datapoint.STATE] = [];
            }

            //checks if the datapoint's county already exists in the datapoint's state dictionary entry of the distribution dictionary
            if (!distribution[datapoint.STATE][datapoint.CZ_NAME]) {

                //checks if the datapoint's state is found in the list of known state names
                if (this.countiesInStates[datapoint.STATE]) {

                    if (datapoint.CZ_NAME && datapoint.STATE) {
                        //County name is already known
                        if (this.countiesInStates[datapoint.STATE][datapoint.CZ_NAME]) {
                            distribution[datapoint.STATE][datapoint.CZ_NAME] = [];
                        }
                        //County name is not known (ex: northern Cook county) but was found by parsing (removed northern and county, leaving only Cook)
                        else if (this.countiesInStates[datapoint.STATE][mappedKeywords[datapoint.STATE][datapoint.CZ_NAME]]) {
                            name = mappedKeywords[datapoint.STATE][datapoint.CZ_NAME];
                        }
                        //County name is not known and has not yet been parsed, so try parsing it to find its actual county name
                        else {
                            var newCountyName = this.findMissingCounty(datapoint.CZ_NAME, datapoint.STATE)
                            //found actual county name by parsing
                            if (this.countiesInStates[datapoint.STATE][newCountyName]) {
                                name = newCountyName;
                                distribution[datapoint.STATE][newCountyName] = [];
                                mappedKeywords[datapoint.STATE][datapoint.CZ_NAME] = newCountyName;

                            }
                            //datapoint's county name was not found so add it to a list for later reference
                            else {
                                name = "MISSING"
                                missing[datapoint.STATE].push(datapoint);
                            }
                        }
                    }

                }


            }

            distributionOfStormsInEachState[datapoint.STATE].push(datapoint);
            stormDistUSA[stormTypes.dictToCategories[datapoint.EVENT_TYPE]]++;
            if (distribution[datapoint.STATE][name])
                distribution[datapoint.STATE][name].push(datapoint);
        });
        this.missing = missing;

        this.distribution_state = distributionOfStormsInEachState;
        //add information for the US data to Queriable regions
        this.queriableRegion = new QueriableRegions();
        this.queriableRegion.addRegion("USA", "2018", stormDistUSA, false);
        this.dataLengths = { "2018": data2018.length };
        return distribution;
    }

    sortFunction(a, b) {
        var initialSort = a[1].length - b[1].length;
        if (initialSort !== 0) return initialSort;
        return a[0].localeCompare(b[0]);
    }

   /**
    * Creates quartiles for states
    * {Texas:1 California:2 Alaska:2 ... }
    */
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

    CreateCountyDistributionForState(stormsInEachCounty) {
        //create sorted list in form [[1,California],[3,Washington]...]
        stormsInEachCounty.sort((a, b) => { return this.sortFunction(a, b) });

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
        return quartileDict;

    }

    createCountyDistributions() {

        //create sorted list in form [[1,California],[3,Washington]...]
        var keysStates = Object.keys(this.stormsInEachCounty);
        var countyQuartiles = {};

        keysStates.map(state => {
            this.keywordsRemovedForEachState[state] = {};
            if (this.countiesInStates[state]) {
                var stateData = this.stormsInEachCounty[state];
                var StormsInEachCounty = [];
                var keysCounties = Object.keys(stateData);
                keysCounties.forEach((county) => {
                    var countyName = county;
                    if (this.countiesInStates[state][county])
                        StormsInEachCounty[countyName] = [countyName, stateData[county]]
                });

                countyQuartiles[state] = this.CreateCountyDistributionForState(Object.values(StormsInEachCounty));
            }
        });


        return countyQuartiles;

    }

    //Some of the data has county names surrounded by gibberish. This method seeks to have more datapoints included 
    //which is accomplished by parsing out gibberish words(such as Eastern or Northern)
    //#TODO REPLACE WITH REGEX
    findMissingCounty(CountyName, State) {
        var newCountyName = CountyName;
        var wordsToSplitBy = Object.keys(keywordsToRemove[State]);
        wordsToSplitBy.forEach(word => {
            if (newCountyName.indexOf(word) != -1) {

                var split = newCountyName.split(word);
                if (split[0]) {
                    newCountyName = split[0].trim();
                }
                else if (split[1]) {
                    newCountyName = split[1].trim();
                }

                //a split word is 
                if (this.countiesInStates[State][newCountyName]) {
                    return newCountyName;
                }
            }
        });

        //still not found
        if (newCountyName == CountyName) {
            newCountyName = CountyName.replace(/\s/g, '');
            if (this.countiesInStates[State][newCountyName])
                return newCountyName;
            else
                return null;

        }
        return newCountyName;
    }

}



export class Borders {
    constructor() {
        this.county_borders_list = this.generateCountyBorders();
        this.generateStateBorders();
    }

    //creates a list of all borders to be rendered
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
    const color = "#" + getTintValue(quartile, quartile_range, RGB[0]) + getTintValue(quartile, quartile_range, RGB[1]) + getTintValue(quartile, quartile_range, RGB[2]);
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