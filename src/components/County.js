import Polygon from 'google-maps-react';
import { connect } from 'react-redux';
import React, {
  Component
} from 'react';

class County extends Polygon {
  constructor(props) {
    super(props);
    this.paths = props.paths;
    this.state = {
      myState: props.state
    };
  }
  renderPolygon() {
    // var isVisible = this.props.selectedState == this.state.myState;
    // return <Polygon
    //   visible={isVisible}
    //   paths={this.paths}
    //   strokeColor={"#000000"}
    //   strokeOpacity={0.8}
    //   strokeWeight={2}
    //   fillColor={"0000FF"}
    //   fillOpacity={0.35}
    // />
    if (this.props.state == this.props.selectedState)
      return super.renderPolygon();
    else return null;
  }

}

const mapStateToProps = (state) => ({
  selectedState: state.selectedState
});

const mapDispatchToProps = (dispatch) => ({

});
// const CountyElement =connect(mapStateToProps, mapDispatchToProps)(County);
export default connect(mapStateToProps, mapDispatchToProps)(County);