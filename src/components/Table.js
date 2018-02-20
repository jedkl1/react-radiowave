
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

const data = require('../../listStations.json');
const dataDAB = require('../../listDAB.json');

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
        selected: props.selected,
    };

    const options = {
        sizePerPageList: [{
            text: '5', value: 5,
        }, {
            text: '10', value: 10,
        },
        {
            text: '20', value: 20,
        }],
        sizePerPage: 5,
    };

    let table = null;
    if (props.system === 'FM') {
        table = (<BootstrapTable
            data={data.station}
            selectRow={selectRowProp}
            striped
            hover
            condensed
            pagination
            search
            options={options}>
            <TableHeaderColumn isKey dataField="uniqId" hidden>ID</TableHeaderColumn>
            <TableHeaderColumn dataField="icon" dataFormat={iconFormat} width="10%">Icon</TableHeaderColumn>
            <TableHeaderColumn dataField="name" dataFormat={stationFormat} width="25%">Name</TableHeaderColumn>
            <TableHeaderColumn dataField="frequency" width="15%">Frequency</TableHeaderColumn>
            <TableHeaderColumn dataField="transmitter" dataFormat={transmitterFormat}>Transmitter</TableHeaderColumn>
        </BootstrapTable>);
    } else if (props.system === 'DAB+') {
        table = (<BootstrapTable
            data={dataDAB.station}
            selectRow={selectRowProp}
            striped
            hover
            condensed
            pagination
            search
            options={options}>
            <TableHeaderColumn isKey dataField="uniqId" hidden>ID</TableHeaderColumn>
            <TableHeaderColumn dataField="icon" dataFormat={iconFormat} width="10%">Icon</TableHeaderColumn>
            <TableHeaderColumn dataField="name" dataFormat={stationFormat} width="25%">Name</TableHeaderColumn>
            <TableHeaderColumn dataField="frequency" width="15%">Frequency</TableHeaderColumn>
            <TableHeaderColumn dataField="transmitter" dataFormat={transmitterFormat}>Transmitter</TableHeaderColumn>
            <TableHeaderColumn dataField="kanal" width="10%">Canal</TableHeaderColumn>
            <TableHeaderColumn dataField="wojewodztow" width="10%">Region</TableHeaderColumn>
        </BootstrapTable>);
    } else if (props.system === 'MUX') {
        table = null;
    }

    return (
        <div>
            { table }
        </div>
    );
}

export default Table;
