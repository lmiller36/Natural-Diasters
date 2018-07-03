import { Polygon } from "google-maps-react/dist/components/Polygon";
import React, {
    Component
} from 'react';
<<<<<<< HEAD
import * as actions from '../redux/actions';
import { connect } from 'react-redux';
=======
>>>>>>> 7abe8b72fd096027c67807d622297239bef8c2df

class State extends Polygon {
    constructor(props) {
        super(props);
<<<<<<< HEAD
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
=======

    }
}
export default (State);
//  <Polygon
//             onClick={() => (
//                 callbackClickedState(border.state)
//             )}
//             paths={convertToLatLngArr(border.border)}
//             strokeColor={"#000000"}
//             strokeOpacity={0.8}
//             strokeWeight={2}
//             fillColor={getFillColor(border.state, quartileDict, quartile_range)}
//             fillOpacity={0.35}
//         // onMouseover={
//         //   () => (
//         //     this.toggleInfoWindow(border.state)
//         //   )
//         // } 
//         >

//         </Polygon>
>>>>>>> 7abe8b72fd096027c67807d622297239bef8c2df
