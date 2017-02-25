import React, { Component, PropTypes } from 'react';


class ArrowHeadDef extends Component {
    propTypes: {
        markerId: PropTypes.string
    }

    render () {
        return (
            <defs>
                <marker
                    id={this.props.markerId}
                    refX="3"
                    refY="2"
                    markerWidth="3"
                    markerHeight="4"
                    orient="auto">
                    <path
                        stroke="black" 
                        fill="black"
                        fillOpacity="1"
                        d="M 0,0 V 4 L3,2 Z"></path>
                </marker>
            </defs>
        );
    }
}

export default ArrowHeadDef;
