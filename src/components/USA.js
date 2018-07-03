import React, {
    Component
} from 'react';
import * as actions from '../redux/actions';
import { connect } from 'react-redux';
import data from '../csv/data_2018.json';
import states from '../csv/states.json';
import State from './State';
import { Map, Marker, InfoWindow, Polygon, GoogleApiWrapper } from 'google-maps-react';
class USA extends Component{
}