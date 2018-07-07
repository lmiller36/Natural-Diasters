import { Polygon } from "google-maps-react/dist/components/Polygon";
import { connect } from 'react-redux';

class State extends Polygon {
    constructor(props) {
        super(props);
        this.state = {
            myState: props.state
        }

    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props !== prevProps){
            // console.log(prevProps);
            // console.log("TO");
            // console.log(this.props);
            this.renderPolygon();
        }
        // if (this.props.fillColor !== prevProps.fillColor) {
        //     //console.log(prevProps.fillColor+" TO "+this.props.fillColor)
        //     this.renderPolygon();
        // }
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

