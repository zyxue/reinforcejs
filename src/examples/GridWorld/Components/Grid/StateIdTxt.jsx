import React, { Component, PropTypes } from 'react';


class StateIdTxt extends Component {
    propTypes: {
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        stateId: PropTypes.number.isRequired
    }

    render() {
        const {x, y, stateId} = this.props;
        return (
                <text x={x} y={y}
                      textAnchor="end"
                      dominantBaseline="text-before-edge"
                      fontSize=".7em" fill="blue">
                    id{stateId}
                </text>
        );
    }
}

export default StateIdTxt;
