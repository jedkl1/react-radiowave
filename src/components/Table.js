
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import Search from './Search';

let data = null;
let selectedSearch = 'name';

fetch('http://mapy.radiopolska.pl/api/transmitterByProgName/pl/fm/r')
    .then(res => res.json())
    .then(
    (res) => {
        data = res.data;
    },
    (error) => {
        console.log(`Error: ${error}`);
    },
);

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

function handleSearch(e) {
    console.log(e);
}

function handleSelect(e) {
    selectedSearch = e.target.value;
    console.log(selectedSearch);
}

function Table(props) {
    const selectedTrasmitters = [];
    props.selected.forEach((element) => {
        selectedTrasmitters.push(element.id_nadajnik);
    });

    const selectRowProp = {
        mode: 'checkbox',
        clickToSelect: true,
        bgColor: 'rgba(240, 129, 104, 0.7)',
        onSelect: props.onRowSelect,
        onSelectAll: props.onSelectAll,
        selected: selectedTrasmitters,
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
    if (props.system === 'fm') {
        table = (
            <div>
                <TableHeaderColumn isKey dataField="id_nadajnik" hidden>ID</TableHeaderColumn>
                <TableHeaderColumn dataField="logo" dataFormat={iconFormat} width="10%">Ikona</TableHeaderColumn>
                <TableHeaderColumn dataField="program" dataFormat={stationFormat} width="25%">Program</TableHeaderColumn>
                <TableHeaderColumn dataField="mhz" width="15%">MHz</TableHeaderColumn>
                <TableHeaderColumn dataField="obiekt" dataFormat={radioMastFormat}>Obiekt nadawczy</TableHeaderColumn>
            </div>);
    } else if (props.system === 'dab') {
        table = (
            <div>
                <TableHeaderColumn isKey dataField="id_nadajnik" hidden>ID</TableHeaderColumn>
                <TableHeaderColumn dataField="logo" dataFormat={iconFormat} width="10%">Ikona</TableHeaderColumn>
                <TableHeaderColumn dataField="multipleks" dataFormat={stationFormat} width="25%">Multipleks</TableHeaderColumn>
                <TableHeaderColumn dataField="mhz" width="15%">MHz</TableHeaderColumn>
                <TableHeaderColumn dataField="obiekt" dataFormat={radioMastFormat}>Obiekt nadawczy</TableHeaderColumn>
                <TableHeaderColumn dataField="kanal_nazwa" width="10%">Kanał</TableHeaderColumn>
                <TableHeaderColumn dataField="nwoj" width="10%">woj.</TableHeaderColumn>
            </div>);
    } else if (props.system === 'dvbt') {
        table = null;
    }

    return (
        <div>
            <select id="searchSelection" onChange={handleSelect}>
                <option value="name">Nazwa stacji</option>
                <option value="freq">Częstotliwość</option>
            </select>
            <Search onChange={handleSearch} />
            <BootstrapTable
                data={data}
                selectRow={selectRowProp}
                striped
                hover
                condensed
                pagination
                search
                options={options}>
                { table.props.children }
            </BootstrapTable>
        </div>
    );
}

export default Table;
