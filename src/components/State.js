import { Polygon } from "google-maps-react/dist/components/Polygon";
import { connect } from 'react-redux';

class State extends Polygon {
    constructor(props) {
        super(props);
        this.state = {
            myState: props.state
        }

    }

    //fix so rerendering isn't happening a bagillion times
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.map !== prevProps.map) {
            //  console.log(prevProps);
            console.log("TO");
            //  console.log(this.props);
            this.renderPolygon();
        }
        else
            if (this.props.fillColor !== prevProps.fillColor) {
                // console.log('here');
                //console.log(prevProps.fillColor+" TO "+this.props.fillColor)
                this.renderPolygon();
            }
    }

    // shouldComponentUpdate(nextProps, nextState) {

    //     if (this.props.map == null && this.props.map !== nextProps.map) {
    //         console.log('here');

    //         // console.log(nextProps);
    //         // console.log(this.props);
    //         return true;
    //     }
    //     return false;

    // }



    renderPolygon() {

        // console.log('here');
        // if (this.props.selectedState === this.props.state)
        //     return null;
        // else
        return super.renderPolygon();
    }
}

const mapStateToProps = (state) => ({
    selectedState: state.selectedState
});

export default connect(mapStateToProps)(State);

