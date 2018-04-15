import React from 'react';

import './../styles/Legend.css';

function Legend(props) {
    if (props.legend) {
        const colors = Object.keys(props.legend.legenda).map(i => props.legend.legenda[i]);
        const voltages = Object.keys(props.legend.legenda);

        const legendFields = [];
        for (let i = 0; i < colors.length; i += 1) {
            voltages[i] = voltages[i].split('_').pop();
            legendFields.push(
                <div className="legendField" key={`legend${i.toString()}`}>
                    <div className="legendColor" key={`color${i.toString()}`} style={{ backgroundColor: `#${colors[i]}` }} />
                    <b key={`voltage${i.toString()}`}>{voltages[i]}</b>
                </div>,
            );
        }

        return (
            <div className="legendContainer">
                {legendFields}
            </div>
        );
    }
    return (
        <div className="legendContainer" />
    );
}

export default Legend;
