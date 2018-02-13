
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

const data = require('../../listStations.json');

function transmitterFormat(cell, row) {
    return (<a href={row.linkToRP}>{cell}</a>);
}

function stationFormat(cell, row) {
    return (<a href={row.linkToStation}>{cell}</a>);
}

function iconFormat(cell) {
    return (<div style={{
        width: '5em',
        height: '1.45em',
        backgroundImage: `url(${cell})`,
        borderRadius: '2px',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    }} />);
}

function Table(props) {
    const selectRowProp = {
        mode: 'checkbox',
        clickToSelect: true,
        bgColor: 'rgb(233, 149, 233)',
        onSelect: props.onRowSelect,
        onSelectAll: props.onSelectAll,
    };

    return (
        <BootstrapTable data={data.station} selectRow={selectRowProp} striped hover condensed pagination search>
            <TableHeaderColumn dataField="icon" dataFormat={iconFormat} width="10%">Icon</TableHeaderColumn>
            <TableHeaderColumn dataField="name" isKey dataFormat={stationFormat}>Name</TableHeaderColumn>
            <TableHeaderColumn dataField="frequency" width="15%">Frequency</TableHeaderColumn>
            <TableHeaderColumn dataField="transmitter" dataFormat={transmitterFormat}>Transmitter</TableHeaderColumn>
        </BootstrapTable>
    );
}

export default Table;
