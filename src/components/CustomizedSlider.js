import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import React, {
    Component
} from 'react';

class CustomizedSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 255,
            R: 0,
            G: 0,
            B: 255
        };
        this.callbackValue = props.onUpdate;

    }
    onRangeChange = (value) => {
        this.setState({ R: Math.round(256 * (value[1] - value[0]) / 99) });
        this.setState({ G: Math.round(256 * (value[2] - value[1]) / 99) });
        this.setState({ B: Math.round(256 * (value[3] - value[2]) / 99) });
    }

    onAfterChange = (value) => {
        this.callbackValue(value);
    }

    ensureLengthTwo(num) {
        var str = num.toString(16) + "";
        if (str.length < 2) str = "0" + str;
        if (str.length > 2) str = "FF"
        return str;
    }

    render() {
        var squareSize = {
            width: '30px',
            height: '30px',
            float: "left",
            marginRight: "40px"
        };

        var slider = {
            marginLeft: "40px",
            marginTop: "9px",
            width: '90%'
        };


        var backgroundColor = "#"
            + this.ensureLengthTwo(this.state.R)
            + this.ensureLengthTwo(this.state.G)
            + this.ensureLengthTwo(this.state.B);

        var style = {
            fill: backgroundColor,
            width: '100%',
            height: '100%',
        };


        //var square = <ColorSquare R={this.state.R} G={this.state.G} B={this.state.B} />


        return (

            <div>
                <div style={squareSize}>
                    <svg style={{ fill: "#" + this.ensureLengthTwo(this.state.R) + this.ensureLengthTwo(this.state.G) + this.ensureLengthTwo(this.state.B), width: '100%', height: '100%' }}>
                        <rect style={style} />
                    </svg>
                </div>
                <div style={slider}>
                    <Range count={4} defaultValue={[10, 20, 30, 80]} pushable={0} onChange={this.onRangeChange} onAfterChange={this.onAfterChange} min={1} max={99}
                        trackStyle={[{ backgroundColor: 'red' }, { backgroundColor: 'green' }]}
                        handleStyle={[{ backgroundColor: 'yellow' }, { backgroundColor: 'gray' }]}
                        railStyle={{ backgroundColor: 'black' }}
                    />
                </div>
            </div>
        );
    }
}

export default (CustomizedSlider);