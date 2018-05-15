
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
    const selectedToDrawTrasmitters = [];
    props.selected.forEach((element) => {
        selectedToDrawTrasmitters.push(element.id_nadajnik);
    });

    const selectRowProp = {
        mode: 'checkbox',
        clickToSelect: true,
        bgColor: 'rgba(240, 129, 104, 0.7)',
        onSelect: props.onRowSelect,
        onSelectAll: props.onSelectAll,
        selected: selectedToDrawTrasmitters,
    };

    let table = null;
    if (props.system === 'fm') {
        table = (
            <div>
                <TableHeaderColumn isKey dataField="id_nadajnik" hidden>ID</TableHeaderColumn>
                <TableHeaderColumn dataField="mhz" width="15%">MHz</TableHeaderColumn>
                <TableHeaderColumn dataField="program" dataFormat={stationFormat} width="40%">Program</TableHeaderColumn>
                <TableHeaderColumn dataField="obiekt" dataFormat={radioMastFormat}>Obiekt nadawczy</TableHeaderColumn>
            </div>);
    } else if (props.system === 'dab' || props.system === 'dvbt') {
        table = (
            <div>
                <TableHeaderColumn isKey dataField="id_nadajnik" hidden>ID</TableHeaderColumn>
                <TableHeaderColumn dataField="kanal_nazwa" width="15%">Kanał</TableHeaderColumn>
                <TableHeaderColumn dataField="multipleks" dataFormat={stationFormat} width="30%">Multipleks</TableHeaderColumn>
                <TableHeaderColumn dataField="obiekt" dataFormat={radioMastFormat}>Obiekt nadawczy</TableHeaderColumn>
            </div>);
    }

    return (
        <div className="littleTable">
            <div className="circleTip" />
            <BootstrapTable
                data={props.data}
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
