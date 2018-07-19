import stormTypes from '../csv/categories.json'
export class QueriableRegions {
    constructor() {
        this.rangeData = {};
    }

    //Adds a given region & year's data to a dictionary, for the purposes of rendered the piechart
    addRegion(region, year, data, shouldSeparateByStorm) {
        if (!this.rangeData[region]) this.rangeData[region] = {};
        if (!this.rangeData[region][year]) {
            if (shouldSeparateByStorm) {
                this.rangeData[region][year] = this.createSections(this.createStormTypeDistribution(data));
            }
            else
                this.rangeData[region][year] = this.createSections(data);

        }
        // else this.rangeData[region][year];
    }

    createStormTypeDistribution(data) {
        const stormDist = {};

        stormTypes.categories.forEach(stormType => {
            stormDist[stormType] = 0;
        });

        data.forEach(datapoint => {
            stormDist[stormTypes.dictToCategories[datapoint.EVENT_TYPE]]++;
        });

        return stormDist;
    }

    /**
     * creates piechart data object
     * @param {*} data 
     * {
     * data = givenData
     * total= total storms in dataset
     * piechartdata = [{ title: Winter value: 10 color:#FF00FF} ... ]
     * 
     * }
     */
    createSections(data) {
        var section = {};
        section["data"] = data;
        section["pieChartData"] = [];
        section["total"] = data.length;
        Object.keys(data).forEach(stormType => {
            section["pieChartData"].push({ title: stormType, value: data[stormType], color: this.createRandomColor() });
        });
        console.log(section);
        return section;
    }

    //RGB w/ each value(i.e. R,G,B) between 0-255 inclusive
    createRandomColor() {
        return "#" + Math.trunc(Math.random() * 256).toString(16) + Math.trunc(Math.random() * 256).toString(16) + Math.trunc(Math.random() * 256).toString(16);
    }

}

export default QueriableRegions;