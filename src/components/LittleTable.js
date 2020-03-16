import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { linkCellFormat, linkCellsProps } from '../helpers/table';

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import '../styles/LittleTable.css';

class LittleTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTransmitters: props.selected,
      selectedIDs: [],
      open: true,
      addTransmiter: false,
    };
    this.updateSelectedIDs = this.updateSelectedIDs.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleAddTransmiterClick = this.handleAddTransmiterClick.bind(this);
  }

  updateSelectedIDs() {
    const { selected } = this.props;
    const IDs = [];

    selected.forEach((transmitter) => {
      IDs.push(transmitter.id_nadajnik);
    });
    this.setState({
      selectedIDs: IDs,
      selectedTransmitters: selected,
    });
  }

  componentDidMount() {
    this.updateSelectedIDs();
  }

  componentDidUpdate(prevProps) {
    const { selected, addTransmiter } = this.props;

    if (selected !== prevProps.selected) {
      this.updateSelectedIDs();
    } else if (addTransmiter !== prevProps.addTransmiter) {
      this.state.addTransmiter = addTransmiter;
    }
  }

  onDrawSelected(row, isSelected) {
    const { addTransmiter, selectedTransmitters } = this.state;
    const { callbackFromApp, checkMultiple } = this.props;

    let tempArray = selectedTransmitters.slice();
    if (isSelected) {
      // add new object which was selected
      if (!checkMultiple) {
        tempArray = [];
      }
      tempArray.push(row);
    } else if (!isSelected) {
      // remove object which has same id_nadajnik as exist
      tempArray = tempArray.filter((obj) => obj.id_nadajnik !== row.id_nadajnik);
    }

    this.setState({ selectedTransmitters: tempArray }, () => {
      callbackFromApp(tempArray, addTransmiter);
      this.updateSelectedIDs();
    });
  }

  onDrawAllSelected(isSelected, rows) {
    const { selectedTransmitters } = this.state;
    const { callbackFromApp } = this.props;

    let tempArray = selectedTransmitters.slice();
    if (isSelected) {
      rows.forEach((element) => {
        tempArray.push(element);
      });
    } else {
      rows.forEach((element) => {
        tempArray = tempArray.filter(
          (obj) => obj.id_nadajnik !== element.id_nadajnik,
        );
      });
    }

    this.setState({ selectedTransmitters: tempArray }, () => {
      callbackFromApp(tempArray);
      this.updateSelectedIDs();
    });
  }

  handleClick() {
    const { open } = this.state;
    this.setState({ open: !open }, () => { });
  }

  handleAddTransmiterClick() {
    const { selectedTransmitters } = this.state;
    const { callbackFromApp } = this.props;

    this.setState({ addTransmiter: true }, () => {
      callbackFromApp(selectedTransmitters, true);
    });
  }

  render() {
    const { checkMultiple, data, system } = this.props;
    const { open, selectedIDs } = this.state;

    const selectRowProp = checkMultiple
      ? {
        mode: 'checkbox',
        clickToSelect: true,
        bgColor: 'rgba(240, 129, 104, 0.7)',
        onSelect: this.onDrawSelected.bind(this),
        onSelectAll: this.onDrawAllSelected.bind(this),
        selected: selectedIDs,
      }
      : {
        mode: 'radio',
        clickToSelect: true,
        bgColor: 'rgba(240, 129, 104, 0.7)',
        onSelect: this.onDrawSelected.bind(this),
        selected: selectedIDs,
      };
    let table = null;
    if (system === 'fm') {
      table = (
        <div>
          <TableHeaderColumn isKey dataField="id_nadajnik" hidden>
            ID
          </TableHeaderColumn>
          <TableHeaderColumn dataField="mhz" width="15%">
            MHz
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="program"
            dataFormat={(cell, row) => linkCellFormat(cell, row, linkCellsProps.station)}
            width="40%">
            Program
          </TableHeaderColumn>
          <TableHeaderColumn dataField="obiekt" dataFormat={(cell, row) => linkCellFormat(cell, row, linkCellsProps.obiekt)}>
            Obiekt nadawczy
          </TableHeaderColumn>
        </div>
      );
    } else if (system === 'dab' || system === 'dvbt') {
      table = (
        <div>
          <TableHeaderColumn isKey dataField="id_nadajnik" hidden>
            ID
          </TableHeaderColumn>
          <TableHeaderColumn dataField="kanal_nazwa" width="15%">
            Kanał
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="multipleks"
            dataFormat={(cell, row) => linkCellFormat(cell, row, linkCellsProps.mux)}
            width="30%">
            Multipleks
          </TableHeaderColumn>
          <TableHeaderColumn dataField="obiekt" dataFormat={(cell, row) => linkCellFormat(cell, row, linkCellsProps.obiekt)}>
            Obiekt nadawczy
          </TableHeaderColumn>
        </div>
      );
    }

    return data ? (
      <div className={`littleTable ${open}`}>
        <button
          type="button"
          aria-label="hide transmitters check table"
          className="circleButton"
          onClick={this.handleClick} />
        <BootstrapTable
          data={data}
          selectRow={selectRowProp}
          striped
          hover
          condensed>
          {table.props.children}
        </BootstrapTable>
        <div className="AddTransmitter">
          <button
            type="button"
            className="button"
            onClick={this.handleAddTransmiterClick}>
            Dodaj nadajnik
          </button>
        </div>
      </div>
    ) : null;
  }
}

export default LittleTable;
