
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import '../styles/LittleTable.css';

function radioMastFormat(cell, row) {
    return (<a href={`http://test.radiopolska.pl/wykaz/obiekt/${row.id_obiekt}`}>{cell}</a>);
}

function stationFormat(cell, row) {
    return (<a href={`http://test.radiopolska.pl/wykaz/program/${row.id_program}`}>{cell}</a>);
}


function LittleTable(props) {
    const selectRowProp = {
        mode: 'checkbox',
        clickToSelect: true,
        bgColor: 'rgb(233, 149, 233)',
        onSelect: props.onRowSelect,
        onSelectAll: props.onSelectAll,
        selected: props.selected,
    };


    let table = null;
    if (props.system === 'fm') {
        table = (
            <div>
                <TableHeaderColumn isKey dataField="id_nadajnik" width="10%" hidden>ID</TableHeaderColumn>
                <TableHeaderColumn dataField="program" dataFormat={stationFormat} width="30%">Program</TableHeaderColumn>
                <TableHeaderColumn dataField="mhz" width="10%">MHz</TableHeaderColumn>
                <TableHeaderColumn dataField="obiekt" dataFormat={radioMastFormat}>Obiekt nadawczy</TableHeaderColumn>
            </div>);
    } else if (props.system === 'dab') {
        table = (
            <div>
                <TableHeaderColumn isKey dataField="id_nadajnik" hidden>ID</TableHeaderColumn>
                <TableHeaderColumn dataField="multipleks" dataFormat={stationFormat} width="25%">Multipleks</TableHeaderColumn>
                <TableHeaderColumn dataField="mhz" width="10%">MHz</TableHeaderColumn>
                <TableHeaderColumn dataField="obiekt" dataFormat={radioMastFormat}>Obiekt nadawczy</TableHeaderColumn>
            </div>);
    } else if (props.system === 'dvbt') {
        table = null;
    }

    return (
        <div className="littleTable">
            <BootstrapTable
                data={props.selected}
                selectRow={selectRowProp}
                striped
                hover
                condensed>
                {table.props.children}
            </BootstrapTable>
        </div>
    );
}

export default LittleTable;
