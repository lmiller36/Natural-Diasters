import React, {
    Component
} from 'react';
import { Map, Marker, InfoWindow, Polygon, GoogleApiWrapper } from 'google-maps-react';

class County extends Polygon {
    constructor(props) {
        super(props);
        //this.paths = props.paths;
        //this.myState = props.state;
        this.state = {
            selectedState: "California",
            myState: props.state
        }
        //super.visible = this.state.myState == this.state.selectedState;
      //  this.changeSelectedState = this.changeSelectedState.bind(this);
       // this.changeSelectedState();


        // this.visible = false;
        // // paths={this.paths}
        // this.strokeColor = "#000000"
        // this.strokeOpacity = 0.8
        // this.strokeWeight = 2
        // this.fillColor = "0000FF"
        // this.fillOpacity = 0.35
    }

    // componentDidMount(){
    //     super.componentDidMount();
    //     if (this.state.myState == this.state.selectedState) {
    //         this.visible = true;
    //         console.log('here');
    //         this.renderPolygon();
    //     }
    // }

    changeSelectedState() {
        if (this.myState == this.state.selectedState) {
            this.visible = true;
            this.renderPolygon();
        }
    }


    renderPolygon(){
       // console.log(this.visible);
        super.renderPolygon();
    }


    // renderPolygon() {
    //     this.visible = this.myState == this.state.selectedState;
    //     // console.log(this.myState+" "+this.state.selectedState+" "+shouldBeVisible)
    //     return super.renderPolygon();
    //     // return <Polygon
    //     //     visible={false}
    //     //     paths={this.paths}
    //     //     strokeColor={"#000000"}
    //     //     strokeOpacity={0.8}
    //     //     strokeWeight={2}
    //     //     fillColor={"0000FF"}
    //     //     fillOpacity={0.35}
    //     // />
    // }

}

export default (County);