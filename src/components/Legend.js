import React from 'react';

import '../styles/Legend.css';

function Legend(props) {
  const { legend } = props;

  if (legend) {
    const colors = Object.keys(props.legend.legenda).map(
      (i) => props.legend.legenda[i],
    );
    const voltages = Object.keys(props.legend.legenda);

    const legendFields = [];
    for (let i = 0; i < colors.length; i += 1) {
      voltages[i] = voltages[i].split('_').pop();
      legendFields.push(
        <div className="legendField" key={`legend${i.toString()}`}>
          <div
            className="legendColor"
            key={`color${i.toString()}`}
            style={{ backgroundColor: `#${colors[i]}` }} />
          <b key={`voltage${i.toString()}`}>{voltages[i]}</b>
        </div>,
      );
    }
    legendFields.push(
      <div className="legendField" key="unit">
        <div className="legendColor" style={{ backgroundColor: 'white' }} />
        <b>dB(µV/m)</b>
      </div>,
    );

    return (
      <div className="legendContainer">
        <div className="whiteLegend">{legendFields}</div>
      </div>
    );
  }
  return <div className="legendContainer" />;
}

export default Legend;
