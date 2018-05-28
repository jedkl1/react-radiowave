
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import '../styles/LittleTable.css';

function radioMastFormat(cell, row) {
    return (<a href={`http://test.radiopolska.pl/wykaz/obiekt/${row.id_obiekt}`} target="_blank">{cell}</a>);
}

function stationFormat(cell, row) {
    return (<a href={`http://test.radiopolska.pl/wykaz/program/${row.id_program}`} target="_blank">{cell}</a>);
}


class LittleTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTransmitters: props.selected,
            selectedIDs: [],
            open: false,
        };
        this.updateSelectedIDs = this.updateSelectedIDs.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    updateSelectedIDs() {
        const IDs = [];
        this.props.selected.forEach((transmitter) => {
            IDs.push(transmitter.id_nadajnik);
        });
        this.setState({ selectedIDs: IDs, selectedTransmitters: this.props.selected });
    }

    componentDidMount() {
        this.updateSelectedIDs();
    }

    componentDidUpdate(prevProps) {
        if (this.props.selected !== prevProps.selected) {
            this.updateSelectedIDs();
        }
    }

    onDrawSelected(row, isSelected) {
        let tempArray = this.state.selectedTransmitters.slice();
        if (isSelected) {
            // add new object which was selected
            tempArray.push(row);
        } else if (!isSelected) {
            // remove object which has same id_nadajnik as exist
            tempArray = tempArray.filter(obj => obj.id_nadajnik !== row.id_nadajnik);
        }

        this.setState({ selectedTransmitters: tempArray }, () => {
            this.props.callbackFromApp(this.state.selectedTransmitters);
            this.updateSelectedIDs();
        });
    }

    onDrawAllSelected(isSelected, rows) {
        let tempArray = this.state.selectedTransmitters.slice();
        if (isSelected) {
            rows.forEach((element) => {
                tempArray.push(element);
            });
        } else {
            rows.forEach((element) => {
                tempArray = tempArray.filter(obj => obj.id_nadajnik !== element.id_nadajnik);
            });
        }

        this.setState({ selectedTransmitters: tempArray }, () => {
            this.props.callbackFromApp(this.state.selectedTransmitters);
            this.updateSelectedIDs();
        });
    }

    handleClick() {
        this.setState({ open: !this.state.open }, () => {});
    }

    render() {
        const selectRowProp = {
            mode: 'checkbox',
            clickToSelect: true,
            bgColor: 'rgba(240, 129, 104, 0.7)',
            onSelect: this.onDrawSelected.bind(this),
            onSelectAll: this.onDrawAllSelected.bind(this),
            selected: this.state.selectedIDs,
        };

        let table = null;
        if (this.props.system === 'fm') {
            table = (
                <div>
                    <TableHeaderColumn isKey dataField="id_nadajnik" hidden>ID</TableHeaderColumn>
                    <TableHeaderColumn dataField="mhz" width="15%">MHz</TableHeaderColumn>
                    <TableHeaderColumn dataField="program" dataFormat={stationFormat} width="40%">Program</TableHeaderColumn>
                    <TableHeaderColumn dataField="obiekt" dataFormat={radioMastFormat}>Obiekt nadawczy</TableHeaderColumn>
                </div>);
        } else if (this.props.system === 'dab' || this.props.system === 'dvbt') {
            table = (
                <div>
                    <TableHeaderColumn isKey dataField="id_nadajnik" hidden>ID</TableHeaderColumn>
                    <TableHeaderColumn dataField="kanal_nazwa" width="15%">Kanał</TableHeaderColumn>
                    <TableHeaderColumn dataField="multipleks" dataFormat={stationFormat} width="30%">Multipleks</TableHeaderColumn>
                    <TableHeaderColumn dataField="obiekt" dataFormat={radioMastFormat}>Obiekt nadawczy</TableHeaderColumn>
                </div>);
        }

        return (

            <div className={`littleTable ${this.state.open}`}>
                {
                    <button className="circleButton" onClick={this.handleClick} />
                }
                <BootstrapTable
                    data={this.props.data}
                    selectRow={selectRowProp}
                    striped
                    hover
                    condensed>
                    {table.props.children}
                </BootstrapTable>
            </div>
        );
    }
}

export default LittleTable;
