import { Polygon } from "google-maps-react/dist/components/Polygon";
import React, {
    Component
} from 'react';
import * as actions from '../redux/actions';
import { connect } from 'react-redux';

class State extends Polygon {
    constructor(props) {
        super(props);
        this.state = {
            myState: props.state
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
export default connect(mapStateToProps, mapDispatchToProps)(State);

