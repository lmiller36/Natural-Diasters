
import React, {
    Component
  } from 'react';
  import './App.css';
  import data from './data_2017.json';
  
  import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
  // import HeatmapLayer from "react-google-maps/lib/visualization/HeatmapLayer";
  
  function parseYearMonth(yearMonth) {
    var year = (yearMonth + '').substring(0, 4);
    var monthNum = (yearMonth + '').substring(5);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = months[parseInt(monthNum)];
    //console.log(month + ", " + year);
    return month + "," + year;
  }
  
  
  class MapContainer extends Component {
    constructor(props) {
      super(props);
      // this.handleMarkerClick = this.handleMarkerClick.bind(this);
      // this.state= {activeMarker:null,showingInfoWindow:false}
    }
  
  
    render() {
      const style = {
        width: '50%',
        height: '50%'
      }
  
      console.log(data);
  
      var arr = [];
      for (var i = 0; i < 100; i++) {
        arr.push(data[i]);
      }
  
      // var infoWindow = <InfoWindow
      //   marker={this.state.activeMarker}
      //   visible={this.state.showingInfoWindow}>
      //   <div>
      //     hi
      //   </div>
      // </InfoWindow>;
  
  
      // const listItems = arr.map((list) =>
      //   <Marker title={parseYearMonth(list.YEARMONTH)}
      //     position={{ lat: list.LATITUDE, lng: list.LONGITUDE }}></Marker>
  
  
      // );
  
      var heatMapPoints = [];
      for (var i = 0; i < 100; i++) {
        var entry = arr[i];
        var point = {};
        point['position'] = { lat: entry.LATITUDE, lng: entry.LONGITUDE };
        heatMapPoints.push(point);
      }
  
      console.log(heatMapPoints);
  
      const MapWithAMarker = withGoogleMap(props =>
        <GoogleMap
          defaultZoom={8}
          defaultCenter={{ lat: -34.397, lng: 150.644 }}
          bootstrapURLKeys={{
            key: "AIzaSyDRxBYiF5OC6YDFwVpctIeFjtHg5C7VEKI",
            language: 'ru',
            region: 'ru'
                  }}
        >
          <Marker
            position={{ lat: -34.397, lng: 150.644 }}
          />
        </GoogleMap>
      );
      
  
      //<Marker lat={list.LATITUDE} lng={list.LONGITUDE}></Marker>
      return (
  
  
  
        <body>
          {MapWithAMarker}
          <div className="div">
            <form>
              <input type="checkbox" name="vehicle1" value="Bike" /> I have a bike<br />
              <input type="checkbox" name="vehicle2" value="Car" /> I have a car<br />
              <input type="checkbox" name="vehicle3" value="Boat" /> I have a boat<br />
              <input type="submit" value="Submit" />
            </form>
          </div>
        </body >
      );
  
    }
  }
  
  
  // class App extends React.Component {
  
  
  
  //   render() {
  //     return (
  
  //       GoogleApiWrapper(
  //         (props) => ({
  //           apiKey: "" 
  //         }
  //       ))(MapContainer)
  
  //     );
  
  
  //   }
  //}
  
  export default MapContainer;
  
  
  

/**
 * import React, {
  Component
} from 'react';
import './App.css';
import data from './data_2017.json';

import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";

//var map;

// var heatmapData = [
//   new google.maps.LatLng(37.782, -122.447),
//   new google.maps.LatLng(37.782, -122.445),
//   new google.maps.LatLng(37.782, -122.443),
//   new google.maps.LatLng(37.782, -122.441),
//   new google.maps.LatLng(37.782, -122.439),
//   new google.maps.LatLng(37.782, -122.437),
//   new google.maps.LatLng(37.782, -122.435),
//   new google.maps.LatLng(37.785, -122.447),
//   new google.maps.LatLng(37.785, -122.445),
//   new google.maps.LatLng(37.785, -122.443),
//   new google.maps.LatLng(37.785, -122.441),
//   new google.maps.LatLng(37.785, -122.439),
//   new google.maps.LatLng(37.785, -122.437),
//   new google.maps.LatLng(37.785, -122.435)
// ];

function parseYearMonth(yearMonth) {
  var year = (yearMonth + '').substring(0, 4);
  var monthNum = (yearMonth + '').substring(5);
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var month = months[parseInt(monthNum)];
  //console.log(month + ", " + year);
  return month + "," + year;
}

function doStuff(google, mapDiv) {

  var heatmapData = [
    new google.maps.LatLng(37.782, -122.447),
    new google.maps.LatLng(37.782, -122.445),
    new google.maps.LatLng(37.782, -122.443),
    new google.maps.LatLng(37.782, -122.441),
    new google.maps.LatLng(37.782, -122.439),
    new google.maps.LatLng(37.782, -122.437),
    new google.maps.LatLng(37.782, -122.435),
    new google.maps.LatLng(37.785, -122.447),
    new google.maps.LatLng(37.785, -122.445),
    new google.maps.LatLng(37.785, -122.443),
    new google.maps.LatLng(37.785, -122.441),
    new google.maps.LatLng(37.785, -122.439),
    new google.maps.LatLng(37.785, -122.437),
    new google.maps.LatLng(37.785, -122.435)
  ];

  var heatmap = <HeatmapLayer data={heatmapData} map={mapDiv} />

  // new google.maps.visualization.HeatmapLayer({
  //   data: heatmapData
  // });

  // heatmap.setMap(null);

}

class MapContainer extends Component {
  constructor(props) {
    super(props);
  }

  // handleMarkerClick(marker,infoWindow) {
  //   console.log(marker);
  //   this.setState({

  //     activeMarker: marker,
  //     showingInfoWindow: true
  //   });
  // }

  render() {
    const style = {
      width: '50%',
      height: '50%'
    }

    //console.log(data);

    var arr = [];
    for (var i = 0; i < 100; i++) {
      arr.push(data[i]);
    }



    const listItems = arr.map((list) =>
      <Marker title={parseYearMonth(list.YEARMONTH)}
        position={{ lat: list.LATITUDE, lng: list.LONGITUDE }}></Marker>


    );

    var heatMapPoints = [];
    for (var i = 0; i < 100; i++) {
      var entry = arr[i];
      var point = {};
      point['position'] = { lat: entry.LATITUDE, lng: entry.LONGITUDE };
      heatMapPoints.push(point);
    }

    // map = (
    //   <Map
    //     style={style}
    //     google={this.props.google}
    //     initialCenter={{
    //       lat: 32.9582895,
    //       lng: -117.1600157
    //     }}
    //     bootstrapURLKeys={{
    //       libraries: 'visualization',
    //     }}
    //     zoom={4}
    //   >
    //     {listItems}

    //   </Map>
    // );

    const mapConfig = Object.assign({}, {
      center: { lat: 0, lng: 180 },
      zoom: 2,
      gestureHandling: "cooperative",
      mapTypeId: 'terrain'
    })

    var map = new maps.Map(node, mapConfig);
    // var heatmapData = [];
    // this.props.quakes.map( (quake) => {
    //   let mag
    //   if (quake.properties.mag < 5) { mag = 3 } else if (quake.properties.mag > 6) {mag = 10} else {mag = 5}
    //   heatmapData.push({
    //     location: new google.maps.LatLng(quake.geometry.coordinates[1], quake.geometry.coordinates[0]),
    //     weight: mag
    //   })
    //   const marker = new google.maps.Marker({
    //     position: {lat: quake.geometry.coordinates[1], lng: quake.geometry.coordinates[0]},
    //     map: this.map,
    //     title: quake.properties.title,
    //     icon: {
    //       url: //include a URL for specific icon
    //       }
    //   });
    //   var infowindow = new google.maps.InfoWindow({
    //     content: `<h3>${quake.properties.title}</h3>
    //     <h4>${(new Date(quake.properties.time)).toDateString()}
    //     at depth of ${quake.geometry.coordinates[2]} km</h4>`
    //   });
    //   marker.addListener('click', function() {
    //     infowindow.open(this.map, marker);
    //   });
    // })

    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatMapPoints,
      radius: 35
    });
    heatmap.setMap(map);





    const style = {
      width: '100vw',
      height: '75vh'
    }
    return (
      <div ref="map" style={style}>
        loading map...
        </div>
    )

  }
}


// class App extends React.Component {



//   render() {
//     return (

//       GoogleApiWrapper(
//         (props) => ({
//           apiKey: "" 
//         }
//       ))(MapContainer)

//     );


//   }
//}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDRxBYiF5OC6YDFwVpctIeFjtHg5C7VEKI',
  libraries: ['visualization']
})(MapContainer);



//{
//   const gradient = [
//     'rgba(0, 255, 255, 0)',
//     'rgba(0, 255, 255, 1)',
//     'rgba(0, 191, 255, 1)',
//     'rgba(0, 127, 255, 1)',
//     'rgba(0, 63, 255, 1)',
//     'rgba(0, 0, 255, 1)',
//     'rgba(0, 0, 223, 1)',
//     'rgba(0, 0, 191, 1)',
//     'rgba(0, 0, 159, 1)',
//     'rgba(0, 0, 127, 1)',
//     'rgba(63, 0, 91, 1)',
//     'rgba(127, 0, 63, 1)',
//     'rgba(191, 0, 31, 1)',
//     'rgba(255, 0, 0, 1)'
//   ];

//   const positions = [
//     { lat: 37.782551, lng: -122.445368 },
//     { lat: 37.782745, lng: -122.444586 },
//     { lat: 37.782842, lng: -122.443688 },
//     { lat: 37.782919, lng: -122.442815 },
//     { lat: 37.782992, lng: -122.442112 },
//     { lat: 37.7831, lng: -122.441461 },
//     { lat: 37.783206, lng: -122.440829 },
//     { lat: 37.783273, lng: -122.440324 },
//     { lat: 37.783316, lng: -122.440023 },
//     { lat: 37.783357, lng: -122.439794 },
//     { lat: 37.783371, lng: -122.439687 },
//     { lat: 37.783368, lng: -122.439666 },
//     { lat: 37.783383, lng: -122.439594 },
//     { lat: 37.783508, lng: -122.439525 },
//     { lat: 37.783842, lng: -122.439591 },
//     { lat: 37.784147, lng: -122.439668 }
//   ];
//   var x =       <HeatmapLayer
//   gradient={gradient}
//   opacity={0.3}
//   data={positions}
//   radius={20}
//   map={map}
// />;

// var heatmap = new google.maps.visualization.HeatmapLayer({
//   data: positions,
//   map: map
// });

 // console.log(x);
 */