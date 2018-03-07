
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

const dataDAB = require('../../listDAB.json');

function radioMastFormat(cell, row) {
    return (<a href={`http://test.radiopolska.pl/wykaz/obiekt/${row.id_obiekt}`}>{cell}</a>);
}

function stationFormat(cell, row) {
    return (<a href={`http://test.radiopolska.pl/wykaz/program/${row.id_program}`}>{cell}</a>);
}

function iconFormat(cell) {
    return (<div style={{
        width: '5em',
        height: '1.45em',
        backgroundImage: `url(http://radiopolska.pl/files/thumb/${cell}/300)`,
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
            text: '15', value: 15,
        }],
        sizePerPage: 10,
    };

    let table = null;
    let data = null;
    let baseUrl = 'http://mapy.radiopolska.pl/api/';
    if (props.system === 'FM') {
        fetch(baseURL + '/transmitterByProgName/pl/fm/r')
            .then(res => res.json())
            .then(
            (res) => {
                data = res.data;
            },
            (error) => {
                console.log(`Error: ${error}`);
            },
        );
        table = (<BootstrapTable
            data={data}
            selectRow={selectRowProp}
            striped
            hover
            condensed
            pagination
            search
            options={options}>
            <TableHeaderColumn isKey dataField="id_nadajnik" hidden>ID</TableHeaderColumn>
            <TableHeaderColumn dataField="logo" dataFormat={iconFormat} width="10%">Icon</TableHeaderColumn>
            <TableHeaderColumn dataField="program" dataFormat={stationFormat} width="25%">Name</TableHeaderColumn>
            <TableHeaderColumn dataField="mhz" width="15%">Frequency</TableHeaderColumn>
            <TableHeaderColumn dataField="obiekt" dataFormat={radioMastFormat}>Transmitter</TableHeaderColumn>
        </BootstrapTable>);
    } else if (props.system === 'DAB+') {
        table = (<BootstrapTable
            data={dataDAB}
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
            <TableHeaderColumn dataField="transmitter" dataFormat={radioMastFormat}>Transmitter</TableHeaderColumn>
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
