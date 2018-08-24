
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import '../styles/Spinner.css';

// import Search from './Search';

const data = null;

function radioMastFormat(cell, row) {
    return (<a href={`http://radiopolska.pl/wykaz/obiekt/${row.id_obiekt}`} title="Szczegóły" target="_blank">{cell}</a>);
}

function stationFormat(cell, row) {
    return (<a href={`http://radiopolska.pl/wykaz/program/${row.id_program}`} title="Szczegóły" target="_blank">{cell}</a>);
}

function muxFormat(cell, row) {
    return (<a href={`http://radiopolska.pl/wykaz/mux/${row.id_multipleks}`} title="Szczegóły" target="_blank">{cell}</a>);
}

function mHzFormat(cell, row) {
    return (<a href={`http://radiopolska.pl/wykaz/${row.typ}/${row.id_nadajnik}`} title="Szczegóły" target="_blank">{cell}</a>);
}

function iconFormat(cell) {
    return (<div style={{
        width: '6em',
        height: '2.2em',
        backgroundImage: `url(https://radiopolska.pl/files/thumb/${cell}/300)`,
        borderRadius: '2px',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    }} />);
}

// function handleSearch(e) {
//     console.log(e);
// }

// function handleSelect(e) {
//     selectedSearch = e.target.value;
//     console.log(selectedSearch);
// }


class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTransmitters: props.selected,
            selectedIDs: [],
            system: props.system,
            filteredTransmitters: data,
        };
        this.btnRef = null;
        this.updateSelectedIDs = this.updateSelectedIDs.bind(this);
    }

    onSelect(row, isSelected) {
        let selected = this.state.selectedTransmitters.slice();
        if (isSelected) {
            selected.push(row);
        } else {
            selected = selected.filter(obj => obj.id_nadajnik !== row.id_nadajnik);
        }
        this.setState({ selectedTransmitters: selected }, function () {
            this.props.callbackFromApp(this.state.selectedTransmitters);
            this.updateSelectedIDs();
        });
    }

    onSelectAll(isSelected) {
        const pagingTransmitters = this.btnRef.getTableDataIgnorePaging();
        this.setState({ filteredTransmitters: pagingTransmitters }, () => {
            const transmitters = isSelected ? this.state.filteredTransmitters.map(
                transmitter => transmitter) : [];
            this.setState({ selectedTransmitters: transmitters }, function () {
                this.props.callbackFromApp(this.state.selectedTransmitters);
                this.updateSelectedIDs();
            });
        });
    }

    updateSelectedIDs() {
        const IDs = [];
        this.state.selectedTransmitters.forEach((transmitter) => {
            IDs.push(transmitter.id_nadajnik);
        });
        this.setState({ selectedIDs: IDs });
    }

    componentDidMount() {
        this.updateSelectedIDs();
    }

    // afterSearch(searchText, result) {
    //     this.setState({ filteredTransmitters: result });
    // }

    render() {
        const selectRowProp = {
            mode: 'checkbox',
            clickToSelect: true,
            bgColor: 'rgba(240, 129, 104, 0.7)',
            onSelect: this.onSelect.bind(this),
            onSelectAll: this.onSelectAll.bind(this),
            selected: this.state.selectedIDs,
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
            components: {
                totalText: 'asdasd',
            },
            // afterSearch: this.afterSearch.bind(this),
        };

        let table = null;
        if (this.state.system === 'fm') {
            table = (
                <div>
                    <TableHeaderColumn isKey dataField="id_nadajnik" hidden>ID</TableHeaderColumn>
                    <TableHeaderColumn dataField="logo" dataFormat={iconFormat}>Logotyp</TableHeaderColumn>
                    <TableHeaderColumn
                        dataField="mhz"
                        filter={{ type: 'TextFilter' }}
                        dataFormat={mHzFormat}>MHz</TableHeaderColumn>
                    <TableHeaderColumn
                        dataField="program"
                        dataFormat={stationFormat}
                        filter={{ type: 'TextFilter' }}>Program</TableHeaderColumn>
                    <TableHeaderColumn
                        dataField="obiekt"
                        dataFormat={radioMastFormat}
                        filter={{ type: 'TextFilter' }}>Obiekt nadawczy</TableHeaderColumn>
                    <TableHeaderColumn dataField="nwoj" filter={{ type: 'TextFilter' }}>Woj.</TableHeaderColumn>
                </div>);
        } else if (this.state.system === 'dab' || this.state.system === 'dvbt') {
            table = (
                <div>
                    <TableHeaderColumn isKey dataField="id_nadajnik" hidden>ID</TableHeaderColumn>
                    <TableHeaderColumn dataField="logo" dataFormat={iconFormat}>Logotyp</TableHeaderColumn>
                    <TableHeaderColumn dataField="mhz" dataFormat={mHzFormat} filter={{ type: 'TextFilter' }}>MHz</TableHeaderColumn>
                    <TableHeaderColumn dataField="multipleks" dataFormat={muxFormat} filter={{ type: 'TextFilter' }}>Multipleks</TableHeaderColumn>
                    <TableHeaderColumn dataField="obiekt" dataFormat={radioMastFormat} filter={{ type: 'TextFilter' }}>Obiekt nadawczy</TableHeaderColumn>
                    <TableHeaderColumn dataField="nwoj" filter={{ type: 'TextFilter' }}>woj.</TableHeaderColumn>
                    <TableHeaderColumn dataField="kanal_nazwa" dataFormat={mHzFormat} width="10%" filter={{ type: 'TextFilter' }}>Kanał</TableHeaderColumn>
                </div>);
        }
        const myRef = (el) => { this.btnRef = el; };
        return (
            <div>
                {/* <div>
                    <select id="searchSelection">
                        <option value="name">Nazwa stacji</option>
                        <option value="freq">Częstotliwość</option>
                    </select>
                    <Search />
                </div> */}
                {
                    this.props.data.length ?
                        <BootstrapTable
                            ref={myRef}
                            data={this.props.data}
                            selectRow={selectRowProp}
                            striped
                            hover
                            condensed
                            pagination
                        // search
                            options={options}>
                            { table.props.children }
                        </BootstrapTable>
                    :
                        <div>
                            <h3>Trwa pobieranie nadajnijków, proszę czekać</h3>
                            <div className="spinner">
                                <div className="rect1" />
                                <div className="rect2" />
                                <div className="rect3" />
                                <div className="rect4" />
                                <div className="rect5" />
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default Table;
