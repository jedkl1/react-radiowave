import React, { Component } from 'react';
import RTSelectTable from 'react-table';
import 'react-table/react-table.css';

const jsonFile = require('../../listStations.json');

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: [],
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = () => {
        this.props.onSystemClick(this.props.value);
    }

    render() {
        const data = jsonFile.station;
        const columns = [
            {
                Header: 'Icon',
                accessor: 'icon',
                Cell: row => (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${row.value})`,
                            borderRadius: '2px',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }} />
            ),
            }, {
                Header: 'Name',
                accessor: 'name',
                Cell: cellInfo => (
                    <a href={cellInfo.original.linkToStation}>{cellInfo.original.name}</a>
            ),
            }, {
                Header: 'Frequency',
                accessor: 'frequency',
            }, {
                Header: 'Transmitter', // Custom header components!
                accessor: 'transmitter',
                Cell: cellInfo => (
                    <a href={cellInfo.original.linkToRP}>{cellInfo.original.transmitter}</a>
            ),
            }];

        return (
            <RTSelectTable
                data={data}
                selectable={'true'}
                columns={columns}
                pageSizeOptions={[5, 10]}
                defaultPageSize={5}
                className="-striped -highlight"
                loadingText="Looking for data"
                noDataText="Couldn't find data"
                getTrProps={(state, rowInfo) => ({

                    onClick: () => {
                        this.setState({
                            selected: rowInfo.index,
                        });
                    },
                    style: {
                        background: rowInfo.index === this.state.selected ? '#00afec' : 'white',
                        color: rowInfo.index === this.state.selected ? 'white' : 'black',
                    },
                })} />);
    }
}

export default Table;
