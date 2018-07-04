import React, {
    Component
} from 'react';
import {Polygon } from 'google-maps-react';
import { connect } from 'react-redux';

class County extends Polygon {
    constructor(props) {
        super(props);
        this.state = {
            myState: props.state,
            wasPreviousClick: false
        };
    }


    componentDidUpdate(prevProps) {
        if (this.props.selectedState !== prevProps.selectedState) {
            if (this.state.wasPreviousClick) this.visible = false;
            this.renderPolygon();
        }
    }

    renderPolygon() {

        if (this.props.selectedState == this.state.myState) {
            this.setState({ wasPreviousClick: true })
            return super.renderPolygon();
        }
        else if (this.state.wasPreviousClick) {
            console.log('previous click');
            return super.renderPolygon();
        }


        else return null;

    }

}

const mapStateToProps = (state) => ({
    selectedState: state.selectedState
});

export const CountyElement = connect(mapStateToProps)(County);
export default connect(mapStateToProps)(County);