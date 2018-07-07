
import { Polygon } from 'google-maps-react';
import { connect } from 'react-redux';

class County extends Polygon {
    constructor(props) {
        super(props);
        this.state = {
            myState: props.state,
            wasPreviousClick: false
        };
    }

}

const mapStateToProps = (state) => ({
    selectedState: state.selectedState
});

export const CountyElement = connect(mapStateToProps)(County);
export default connect(mapStateToProps)(County);