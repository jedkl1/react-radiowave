import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import '../../styles/Spinner.css';


const cellFormats = {
  station: {
    path: 'program',
    rowKey: 'id_program',
  },
  mux: {
    path: 'mux',
    rowKey: 'id_multipleks',
  },
  obiekt: {
    path: 'obiekt',
    rowKey: 'id_obiekt',
  },
  mHz: {
    rowKey: 'id_nadajnik',
  },
};

const baseListUrl = 'http://radiopolska.pl/wykaz';

const linkCellFormat = (cell, row, propKeys, isMHz = false) => (
  <a
    href={
      isMHz
        ? `${baseListUrl}/${row.typ}/${row[propKeys.rowKey]}`
        : `${baseListUrl}/${propKeys.path}/${row[propKeys.rowKey]}`
    }
    title="Szczegóły"
    target="_blank"
    rel="noopener noreferrer">
    {cell}
  </a>
);

function iconFormat(cell) {
  return (
    <div
      style={{
        width: '6em',
        height: '2.2em',
        backgroundImage: `url(https://radiopolska.pl/files/thumb/${cell}/300)`,
        borderRadius: '2px',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }} />
  );
}

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTransmitters: props.selected,
      selectedIDs: [],
      system: props.system,
      filteredTransmitters: null,
    };
    this.btnRef = null;
    this.updateSelectedIDs = this.updateSelectedIDs.bind(this);
  }

  onSelect(row, isSelected) {
    const { selectedTransmitters } = this.state;
    const { callbackFromApp } = this.props;

    let selected = selectedTransmitters.slice();
    if (isSelected) {
      selected.push(row);
    } else {
      selected = selected.filter((obj) => obj.id_nadajnik !== row.id_nadajnik);
    }
    this.setState({ selectedTransmitters: selected }, function () {
      callbackFromApp(selected);
      this.updateSelectedIDs();
    });
  }

  onSelectAll(isSelected) {
    const { filteredTransmitters } = this.state;
    const { callbackFromApp } = this.props;
    const pagingTransmitters = this.btnRef.getTableDataIgnorePaging();

    this.setState({ filteredTransmitters: pagingTransmitters }, () => {
      const transmitters = isSelected
        ? filteredTransmitters.map((transmitter) => transmitter)
        : [];
      this.setState({ selectedTransmitters: transmitters }, function () {
        callbackFromApp(transmitters);
        this.updateSelectedIDs();
      });
    });
  }

  updateSelectedIDs() {
    const { selectedTransmitters } = this.state;
    const IDs = [];

    selectedTransmitters.forEach((transmitter) => {
      IDs.push(transmitter.id_nadajnik);
    });
    this.setState({ selectedIDs: IDs });
  }

  componentDidMount() {
    this.updateSelectedIDs();
  }

  render() {
    const { selectedIDs, system } = this.state;
    const { data } = this.props;

    const selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true,
      bgColor: 'rgba(240, 129, 104, 0.7)',
      onSelect: this.onSelect.bind(this),
      onSelectAll: this.onSelectAll.bind(this),
      selected: selectedIDs,
    };

    const options = {
      sizePerPageList: [
        {
          text: '5',
          value: 5,
        },
        {
          text: '10',
          value: 10,
        },
        {
          text: '15',
          value: 15,
        },
      ],
      sizePerPage: 10,
      components: {
        totalText: 'asdasd',
      },
      // afterSearch: this.afterSearch.bind(this),
    };

    let table = null;
    if (system === 'fm') {
      table = (
        <>
          <TableHeaderColumn isKey dataField="id_nadajnik" hidden>
            ID
          </TableHeaderColumn>
          <TableHeaderColumn dataField="logo" dataFormat={iconFormat}>
            Logotyp
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="mhz"
            filter={{ type: 'TextFilter' }}
            dataFormat={(cell, row) => linkCellFormat(cell, row, cellFormats.mHz, true)}>
            {' '}
            MHz
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="program"
            dataFormat={(cell, row) => linkCellFormat(cell, row, cellFormats.station)}
            filter={{ type: 'TextFilter' }}>
            Program
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="obiekt"
            dataFormat={(cell, row) => linkCellFormat(cell, row, cellFormats.obiekt)}
            filter={{ type: 'TextFilter' }}>
            Obiekt nadawczy
          </TableHeaderColumn>
          <TableHeaderColumn dataField="nwoj" filter={{ type: 'TextFilter' }}>
            Woj.
          </TableHeaderColumn>
        </>
      );
    } else if (system === 'dab' || system === 'dvbt') {
      table = (
        <>
          <TableHeaderColumn isKey dataField="id_nadajnik" hidden>
            ID
          </TableHeaderColumn>
          <TableHeaderColumn dataField="logo" dataFormat={iconFormat}>
            Logotyp
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="mhz"
            dataFormat={(cell, row) => linkCellFormat(cell, row, cellFormats.mHz, true)}
            filter={{ type: 'TextFilter' }}>
            MHz
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="multipleks"
            dataFormat={(cell, row) => linkCellFormat(cell, row, cellFormats.mux)}
            filter={{ type: 'TextFilter' }}>
            Multipleks
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="obiekt"
            dataFormat={(cell, row) => linkCellFormat(cell, row, cellFormats.obiekt)}
            filter={{ type: 'TextFilter' }}>
            Obiekt nadawczy
          </TableHeaderColumn>
          <TableHeaderColumn dataField="nwoj" filter={{ type: 'TextFilter' }}>
            woj.
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="kanal_nazwa"
            dataFormat={(cell, row) => linkCellFormat(cell, row, cellFormats.mHz, true)}
            width="10%"
            filter={{ type: 'TextFilter' }}>
            Kanał
          </TableHeaderColumn>
        </>
      );
    }
    const myRef = (el) => {
      this.btnRef = el;
    };
    return (
      <div>
        {data.length ? (
          <BootstrapTable
            ref={myRef}
            data={data}
            selectRow={selectRowProp}
            striped
            hover
            condensed
            pagination
            // search
            options={options}>
            {table.props.children}
          </BootstrapTable>
        ) : (
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
        )}
      </div>
    );
  }
}

export default Table;
