import stormTypes from '../csv/categories.json'
export class QueriableRegions {
    constructor() {
        this.rangeData = {};
    }

    addDataToRange(dataset) {

    }

    //"USA","2018",stormDistUSA
    addRegion(region, year, data, shouldSeparateByStorm) {
        if (!this.rangeData[region]) this.rangeData[region] = {};
        if (!this.rangeData[region][year]) {
            if (shouldSeparateByStorm) {
                this.rangeData[region][year] = this.createSections(this.createStormTypeDistribution(data));
            }
            else
                this.rangeData[region][year] = this.createSections(data);

        }
        else this.rangeData[region][year];
    }

    createStormTypeDistribution(data) {
        const stormDist = {};
        stormTypes.categories.forEach(stormType => {
            stormDist[stormType] = 0;
        }
        )
        data.forEach(datapoint => {
            stormDist[stormTypes.dictToCategories[datapoint.EVENT_TYPE]]++;

        })
        return stormDist;
    }

    createSections(data) {
        var section = {};
        section["data"] = data;
        section["pieChartData"] = [];
        section["total"] = 0;
        Object.keys(data).forEach(stormType => {
            section["pieChartData"].push({ title: stormType, value: data[stormType], color: this.createRandomColor() });
            section["total"] += data[stormType];
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