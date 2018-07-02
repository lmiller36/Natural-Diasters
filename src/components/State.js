import { Polygon } from "google-maps-react/dist/components/Polygon";
import React, {
    Component
} from 'react';

class State extends Polygon {
    constructor(props) {
        super(props);

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