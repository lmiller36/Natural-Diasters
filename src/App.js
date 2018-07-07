import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import configureAndResetStore from './redux/configure-store';
import { Provider } from 'react-redux';
import { GoogleMaps } from './components/Map';


export const store = configureAndResetStore();

class Main extends Component {

  constructor(props) {
    super(props);
  }

  callbackClickedState(state) {
    store.dispatch({
      type: 'UPDATE_SELECTED_STATE',
      selectedState: state
    });
  }



  render() {
    return (
      <GoogleMaps callbackClickedState={this.callbackClickedState} />

    );
  }
}

const mapStateToProps = (state) => ({
  selectedState: state.selectedState,
  center: state.center,
  zoom: state.zoom
});


const MainConnected = connect(mapStateToProps)(Main);

class Wrapper extends Component {

  render() {
    return (
      <Provider store={store}>
        <MainConnected />
      </Provider>
    );
  }
}


export default (Wrapper);
