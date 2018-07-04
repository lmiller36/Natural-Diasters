import React, {
    Component
} from 'react';
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


    componentDidUpdate(prevProps) {
        if (prevProps.visible !== this.props.visible){
            console.log(prevProps.visible + " to " + this.props.visible)
            return this.renderPolygon();
        }

       else if (this.props.selectedState !== prevProps.selectedState) {
            if (prevProps.visible !== this.props.visible)
                console.log(prevProps.visible + " to " + this.props.visible)

            if (this.props.selectedState == this.state.myState) {
                this.setState({ wasPreviousClick: true })
                return this.renderPolygon();

                //return super.renderPolygon();
            }
            else if (this.state.wasPreviousClick) {
                this.setState({ wasPreviousClick: false })
                // console.log('previous click');
                return this.renderPolygon();

                // return super.renderPolygon();
            }
            // if (this.state.wasPreviousClick) this.visible = false;
        }
    }

    renderPolygon() {

        // if (this.props.selectedState == this.state.myState) {
        //   //  this.setState({ wasPreviousClick: true })
        //     return super.renderPolygon();
        // }
        // else if (this.state.wasPreviousClick) {
        //   //  console.log('previous click');
        //     return super.renderPolygon();
        // }


        // else return null; 
        return super.renderPolygon();

    }

}

const mapStateToProps = (state) => ({
    selectedState: state.selectedState
});

export const CountyElement = connect(mapStateToProps)(County);
export default connect(mapStateToProps)(County);