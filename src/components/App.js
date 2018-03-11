import React, { Component } from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';

import '../styles/App.css';
import Map from './Map';
import SystemButton from './Button';
import Table from './Table';
import LittleTable from './LittleTable';

class App extends Component {
    state = { loading: false };

    constructor(props) {
        super(props);
        this.state = {
            isShowingModal: false,
            selectedTransmitters: [],
            system: 'fm',
            toDrawSelected: [],
        };
        this.handleSystemClick = this.handleSystemClick.bind(this);
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
        this.onRowSelect = this.onRowSelect.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.onDrawSelected = this.onDrawSelected.bind(this);
        this.onDrawAllSelected = this.onDrawAllSelected.bind(this);
    }

    onRowSelect(row, isSelected, e) {
        let tempArray = this.state.selectedTransmitters.slice();
        if (isSelected) {
            // add new object which was selected
            tempArray.push(row);
        } else if (!isSelected) {
            // remove object which has same id_nadajnik as exist
            tempArray = tempArray.filter(obj => obj.id_nadajnik !== row.id_nadajnik);
        }
        this.setState({ selectedTransmitters: tempArray }, function () {
            console.log(this.state.selectedTransmitters);
        });
        console.log(e);
    }

    onSelectAll(isSelected, rows) {
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

        this.setState({ selectedTransmitters: tempArray }, function () {
            console.log(this.state.selectedTransmitters);
        });
    }

    onDrawSelected(row, isSelected, e) {
        let tempArray = this.state.toDrawSelected.slice();
        if (isSelected) {
            // add new object which was selected
            tempArray.push(row);
        } else if (!isSelected) {
            // remove object which has same id_nadajnik as exist
            tempArray = tempArray.filter(obj => obj.id_nadajnik !== row.id_nadajnik);
        }

        this.setState({ toDrawSelected: tempArray }, function () {
            console.log(this.state.toDrawSelected);
        });
        console.log(e);
    }

    onDrawAllSelected(isSelected, rows) {
        let tempArray = this.state.toDrawSelected.slice();
        if (isSelected) {
            rows.forEach((element) => {
                tempArray.push(element);
            });
        } else {
            rows.forEach((element) => {
                tempArray = tempArray.filter(obj => obj.id_nadajnik !== element.id_nadajnik);
            });
        }

        this.setState({ toDrawSelected: tempArray }, function () {
            console.log(this.state.toDrawSelected);
        });
    }

    handleSystemClick(id) {
        console.log(`System was set as ${id}`);
        this.setState({ system: id, selectedRows: [], selectedTransmitters: [] });
    }

    handleRefreshClick(value) {
        console.log(`Refresh ${value}`);
        window.location.reload();
    }

    openDialog = () => this.setState({ isShowingModal: true })

    handleClose = () => this.setState({ isShowingModal: false })

    render() {
        const modalStyle = {
            width: '50%',
            textAlign: 'center',
        };

        return (
            <div id="gridId" className="grid">
                <div id="systems_container" className="container systems">
                    <SystemButton id="fm" class="system" title="Change system to FM" value="FM" onSystemClick={this.handleSystemClick} />
                    <SystemButton id="dab" class="system" title="Change system to DAB+" value="DAB+" onSystemClick={this.handleSystemClick} />
                    <SystemButton id="dvbt" class="system" title="Change system to DVB-T" value="DVB-T" onSystemClick={this.handleSystemClick} />
                </div>
                <div id="buttons_container" className="container buttons">
                    <SystemButton id="home" class="home" title="Home" value="" onSystemClick={this.handleRefreshClick} /> <br />
                    <SystemButton id="stations" class="checkStation" title="Check stations to draw" value="" onSystemClick={this.openDialog} />

                </div>
                {
                    this.state.isShowingModal ?
                        <ModalContainer>
                            <ModalDialog style={modalStyle} onClose={this.handleClose}>
                                <h1>Check stations</h1>
                                <Table
                                    system={this.state.system}
                                    onSelectAll={this.onSelectAll}
                                    onRowSelect={this.onRowSelect}
                                    selected={this.state.selectedTransmitters} />
                            </ModalDialog>
                        </ModalContainer>
                    : null
                }
                <SystemButton id="info" class="info" title="info" value="i" onSystemClick={this.handleRefreshClick} />
                {
                    this.state.selectedTransmitters.length ?
                        <LittleTable
                            system={this.state.system}
                            onSelectAll={this.onDrawAllSelected}
                            onRowSelect={this.onDrawSelected}
                            selected={this.state.toDrawSelected}
                            data={this.state.selectedTransmitters} />
                    : null
                }
                <Map selectedTransmitters={this.state.toDrawSelected} />
            </div>
        );
    }
}

export default App;
