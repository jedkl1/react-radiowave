import React, { Component } from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import queryString from 'query-string';

import '../styles/App.css';
import Map from './Map';
import SystemButton from './Button';
import Table from './Table';
import LittleTable from './LittleTable';
import ConfigurationsBox from './ConfigurationsBox';


class App extends Component {
    state = { loading: false };

    constructor(props) {
        super(props);
        this.state = {
            isShowingModal: false,
            selectedTransmitters: [],
            system: 'fm',
            toDrawSelected: [],
            configurations: [],
            selectedConfiguration: null,
        };
        this.handleSystemClick = this.handleSystemClick.bind(this);
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
        this.handleShareClick = this.handleShareClick.bind(this);
        this.onDrawSelected = this.onDrawSelected.bind(this);
        this.onDrawAllSelected = this.onDrawAllSelected.bind(this);
        this.getConfigurations = this.getConfigurations.bind(this);
        this.getSelectedData = this.getSelectedData.bind(this);
        this.getSelectedConfiguration = this.getSelectedConfiguration.bind(this);
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

    getConfigurations() {
        console.log('conf');
        fetch('http://mapy.radiopolska.pl/api/cfg')
            .then(res => res.json())
            .then(
                (res) => {
                    this.setState({ configurations: res.data }, function () {
                        console.log(this.state.configurations);
                    });
                },
                (error) => {
                    console.log(`Error: ${error}`);
                },
            );
    }

    componentDidMount() {
        // create the Leaflet map object
        if (this.props.location.search) {
            const inputParams = queryString.parse(this.props.location.search).config;
            const inputJSON = JSON.parse(inputParams);
            console.log(inputJSON);
            inputJSON.tra.forEach((transmitter) => {
                fetch(`http://mapy.radiopolska.pl/api/transmitterById/pl/fm/${transmitter.id}`)
                    .then(res => res.json())
                    .then(
                    (res) => {
                        const tempArray = this.state.selectedTransmitters.slice();
                        tempArray.push(res.data[0]);
                        this.setState({ selectedTransmitters: tempArray,
                            toDrawSelected: tempArray }, function () {
                            console.log(this.state.selectedTransmitters);
                        });
                    },
                    (error) => {
                        console.log(`Error: ${error}`);
                    },
                );
            });
        }
        this.getConfigurations();
    }

    handleSystemClick(id) {
        console.log(`System was set as ${id}`);
        this.setState({ system: id, selectedRows: [], selectedTransmitters: [] });
    }

    handleRefreshClick(value) {
        console.log(`Refresh ${value}`);
        window.location.reload();
    }

    handleShareClick() {
        let url = 'http://localhost:9000/?config={"tra":[';
        url += this.state.toDrawSelected.map(element => `{"id":${element.id_nadajnik}}`).join(',');
        url += ']}';
        console.log(url);
    }

    openDialog = () => this.setState({ isShowingModal: true })

    handleClose = () => this.setState({ isShowingModal: false })

    getSelectedData = (dataFromTable) => {
        this.setState({ selectedTransmitters: dataFromTable }, function () {
            console.log(this.state.selectedTransmitters);
        });
    }

    getSelectedConfiguration = (dataFromConfiguration) => {
        this.setState({ selectedConfiguration: dataFromConfiguration });
    }

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
                    this.state.configurations.length ?
                        <ConfigurationsBox
                            system={this.state.system}
                            configurations={this.state.configurations}
                            callbackFromApp={this.getSelectedConfiguration} />
                    : null
                }
                {
                    this.state.isShowingModal ?
                        <ModalContainer>
                            <ModalDialog style={modalStyle} onClose={this.handleClose}>
                                <h1>Check stations</h1>
                                <Table
                                    system={this.state.system}
                                    callbackFromApp={this.getSelectedData}
                                    selected={this.state.selectedTransmitters} />
                            </ModalDialog>
                        </ModalContainer>
                    : null
                }
                <SystemButton id="share" class="share" title="Pobierz link do udostępnienia" value="" onSystemClick={this.handleShareClick} />
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
                <Map
                    selectedTransmitters={this.state.toDrawSelected}
                    configuration={this.state.selectedConfiguration} />
            </div>
        );
    }
}

export default App;

// http://localhost:9000/l
// AIzaSyAZgc-xDQ-6Y9aDjj2GztoxTMSnRC6DioM
