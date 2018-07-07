import { Polygon } from "google-maps-react/dist/components/Polygon";
import { connect } from 'react-redux';

class State extends Polygon {
    constructor(props) {
        super(props);
        this.state = {
            myState: props.state
        }

    }




    renderPolygon() {
        if (this.props.selectedState === this.props.state)
            return null;
        else
            return super.renderPolygon();
    }
}

const mapStateToProps = (state) => ({
    selectedState: state.selectedState
});

export default connect(mapStateToProps)(State);

