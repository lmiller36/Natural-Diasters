import { Polygon } from "google-maps-react/dist/components/Polygon";
import React, {
    Component
} from 'react';
import * as actions from '../redux/actions';
import { connect } from 'react-redux';

class State extends Polygon {
    constructor(props) {
        super(props);
        this.onClick=() => (
                //props.callbackClickedState(props.state)
                console.log('Just checking')
            );
        // this.onClick = this.onClick.bind(this);
        // this.onClick=() => (
        //     //props.callbackClickedState(props.state)
        //     console.log('hereClick')
        // );

        this.state = {
            // selectedState: props.selectedState,
            myState: props.state
            // paths: props.paths,
            // fillColor: props.fillColor,
            // inVisible: false
        }

    }




    renderPolygon() {
        if (this.props.selectedState == this.props.state)
            return null;
        else
            return super.renderPolygon();
    }
}

const mapStateToProps = (state) => ({
    selectedState: state.selectedState
});

const mapDispatchToProps = (dispatch) => ({
    updateSelectedState: () => dispatch(actions.updateSelectedState())
});
//const state=
export default connect(mapStateToProps, mapDispatchToProps)(State);