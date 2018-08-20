import React, { Component } from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import queryString from 'query-string';

import '../styles/App.css';
import Map from './Map';
import SystemButton from './Button';
import Table from './Table';
import LittleTable from './LittleTable';
import ConfigurationsBox from './ConfigurationsBox';
import PopUp from './PopUp';
import Info from './Info';

const logoIcon = require('../../images/icons/logoIcon.png');

let data = [];

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowingModal: false,
            isShowingInfo: true,
            isShowingShare: false,
            selectedTransmitters: [],
            selectedSystemTransmitters: [],
            system: null,
            toDrawSelected: [],
            configurations: [],
            selectedConfiguration: null,
            fmClicked: true,
            dabClicked: false,
            dvbtClicked: false,
            loading: false,
            directionalChecked: true,
            openConfiguration: false,
            showFullInfo: true,
            automaticZoom: false,
        };
        this.handleSystemClick = this.handleSystemClick.bind(this);
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
        this.handleShareClick = this.handleShareClick.bind(this);
        this.handleInfoClick = this.handleInfoClick.bind(this);
        this.getConfigurations = this.getConfigurations.bind(this);
        this.getSelectedData = this.getSelectedData.bind(this);
        this.getDrawData = this.getDrawData.bind(this);
        this.getSelectedConfiguration = this.getSelectedConfiguration.bind(this);
        this.setConfiguration = this.setConfiguration.bind(this);
        this.getDirectionalCheckedStatus = this.getDirectionalCheckedStatus.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleInfoClose = this.handleInfoClose.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.checkQueryString = this.checkQueryString.bind(this);
    }

    getConfigurations(configurationString = 'fm-std') {
        fetch('https://mapy.radiopolska.pl/api/cfg')
            .then(res => res.json())
            .then(
                (res) => {
                    this.setState({ configurations: res.data }, function () {
                        this.state.configurations.forEach((configuration) => {
                            if (configuration.cfg === configurationString) {
                                this.setState({ selectedConfiguration: configuration },
                                              () => { });
                            }
                        });
                    });
                },
                // (error) => {
                //     console.log(`Error: ${error}`);
                // },
            );
    }

    componentDidMount() {
        this.checkQueryString();
    }

    checkQueryString() {
        if (this.props.location.search) {
            // ?name=ferret&color=purple
            const inputParams = queryString.parse(this.props.location.search);
            const transmitters = inputParams.tra.split(',');
            transmitters.forEach((transmitter) => {
                fetch(`https://mapy.radiopolska.pl/api/transmitterById/pl/${inputParams.sys}/${transmitter}`)
                    .then(res => res.json())
                    .then(
                    (res) => {
                        const tempArray = this.state.selectedTransmitters.slice();
                        tempArray.push(res.data[0]);
                        this.setState({
                            selectedTransmitters: tempArray,
                            selectedSystemTransmitters: tempArray,
                            showFullInfo: false },
                                      () => { console.log(this.state.selectedTransmitters); });
                    },
                    // (error) => {
                    //     console.log(`Error: ${error}`);
                    // },
                );
            });
            this.setStates(inputParams.sys);
            this.setConfiguration(inputParams.cfg);
            this.setZoom(inputParams.zoom);
        } else {
            this.getConfigurations();
            this.setStates();
        }
    }

    componentDidUpdate(prevProps, prevStates) {
        if (this.state.system !== prevStates.system) {
            let dataUrl = 'https://mapy.radiopolska.pl/api/transmitterAll/pl/';
            if (this.state.system === 'fm') {
                dataUrl += 'fm';
            } else if (this.state.system === 'dab') {
                dataUrl += 'dab';
            } else if (this.state.system === 'dvbt') {
                dataUrl += 'dvbt';
            }
            // console.log(dataUrl);
            fetch(dataUrl)
                .then(res => res.json())
                .then(
                (res) => {
                    data = res.data;
                },
                // (error) => {
                //     console.log(`Error: ${error}`);
                // },
            );
        }
    }

    setStates(paramSystem = false) {
        if (paramSystem) {
            this.setState({ system: paramSystem }, () => {});
        } else {
            this.setState({ system: 'fm' }, () => {});
        }
    }

    setConfiguration(configurationString) {
        this.getConfigurations(configurationString);
    }

    setZoom(isAutomatic) {
        this.setState({ automaticZoom: isAutomatic });
    }

    handleSystemClick(id) {
        if (this.state.system !== id) {
            data = [];
        }

        const currentTransmitters = [];
        this.state.selectedTransmitters.forEach((element) => {
            if (element.typ === id) {
                currentTransmitters.push(element);
            }
        });
        if (id === 'fm') {
            this.setState({ fmClicked: true, dabClicked: false, dvbtClicked: false }, () => { });
        } else if (id === 'dab') {
            this.setState({ fmClicked: false, dabClicked: true, dvbtClicked: false }, () => { });
        } else if (id === 'dvbt') {
            this.setState({ fmClicked: false, dabClicked: false, dvbtClicked: true }, () => { });
        }
        this.setState({ system: id, selectedSystemTransmitters: currentTransmitters }, () => { });
    }

    handleRefreshClick() { }

    handleShareClick() {
        if (this.state.selectedConfiguration) {
            // ?name=ferret&color=purple
            const domain = window.location.port.length ?
                    `${window.location.protocol}//${window.location.hostname}:${window.location.port}${window.location.pathname}`
                    :
                    `${window.location.protocol}//${window.location.hostname}${window.location.pathname}`;
            let url = `${domain}?tra=`;
            url += this.state.toDrawSelected.map(element => `${element.id_nadajnik}`).join(',');
            url += `&cfg=${this.state.selectedConfiguration.cfg}&`;
            url += `sys=${this.state.system}&`;
            url += `zoom=${this.state.automaticZoom}`;
            this.setState({ uri: url, isShowingShare: !this.state.isShowingShare }, () => { });
        }
    }

    openDialog() { this.setState({ isShowingModal: true }); }

    handleClose() { this.setState({ isShowingModal: false }); }

    handleInfoClose() { this.setState({ isShowingInfo: false }); }

    handleInfoClick() { this.setState({ isShowingInfo: true }); }

    getSelectedData(dataFromTable) {
        this.setState({ selectedTransmitters: dataFromTable }, () => {
            const currentTransmitters = [];
            this.state.selectedTransmitters.forEach((element) => {
                if (element.typ === this.state.system) {
                    currentTransmitters.push(element);
                }
            });
            const intersection = currentTransmitters.filter(transmitter =>
                this.state.toDrawSelected.includes(transmitter));
            this.setState({ selectedSystemTransmitters: currentTransmitters,
                toDrawSelected: intersection }, () => {});
        });
    }

    getDrawData(dataFromLittleTable, openTable) {
        this.setState({ toDrawSelected: dataFromLittleTable, isShowingModal: openTable }, () => {});
    }

    getSelectedConfiguration(dataFromConfiguration) {
        this.setState({ selectedConfiguration: dataFromConfiguration });
    }

    getDirectionalCheckedStatus(dataFromConfiguration, automaticZoom) {
        this.setState({ directionalChecked: dataFromConfiguration, automaticZoom });
    }

    render() {
        const modalStyle = {
            width: '65%',
            textAlign: 'center',
        };
        const infoStyle = {
            width: '70%',
            textAlign: 'center',
        };
        const domain = window.location.port.length ?
                    `${window.location.protocol}//${window.location.hostname}:${window.location.port}${window.location.pathname}`
                    :
                    `${window.location.protocol}//${window.location.hostname}${window.location.pathname}`;
        return (
            <div id="gridId" className="grid">
                <div id="systems_container" className="container systems">
                    {
                        this.state.fmClicked ?
                            <SystemButton id="fm" class={'system focus'} title="Zmień system na FM" value="FM" onSystemClick={this.handleSystemClick} />
                        : <SystemButton id="fm" class={'system'} title="Zmień system na FM" value="FM" onSystemClick={this.handleSystemClick} />
                    }
                    {
                        this.state.dabClicked ?
                            <SystemButton id="dab" class={'system focus'} title="Zmień system na DAB+" value="DAB+" onSystemClick={this.handleSystemClick} />
                        : <SystemButton id="dab" class={'system'} title="Zmień system na DAB+" value="DAB+" onSystemClick={this.handleSystemClick} />
                    }
                    {
                        this.state.dvbtClicked ?
                            <SystemButton id="dvbt" class={'system focus'} title="Zmień system na DVB-T" value="DVB-T" onSystemClick={this.handleSystemClick} />
                        : <SystemButton id="dvbt" class={'system'} title="Zmień system na DVB-T" value="DVB-T" onSystemClick={this.handleSystemClick} />
                    }
                </div>
                <a href={domain}> {/* page must stay on https */}
                    <img id="home" className="button home" alt="Odswiez" src={logoIcon} />
                </a>
                <div className="stationsWrapper ButtonWrapper">
                    <button id="stations" className="button checkStation" title="Wybierz stacje do narysowania pokrycia" value="" onClick={this.openDialog} />
                </div>
                <div id="buttons_container" className="container buttons">
                    {
                    this.state.configurations.length ?
                        <ConfigurationsBox
                            system={this.state.system}
                            isOpen={this.state.openConfiguration}
                            configurations={this.state.configurations}
                            selected={this.state.selectedConfiguration}
                            callbackFromApp={this.getSelectedConfiguration}
                            callbackDirectionals={this.getDirectionalCheckedStatus} />
                    : null
                }
                </div>
                {
                    this.state.isShowingModal ?
                        <ModalContainer>
                            <ModalDialog style={modalStyle} onClose={this.handleClose}>
                                <h3>Wybierz nadajniki</h3>
                                {
                                    <div>
                                        <h3>Dla bezpieczeczenstwa swojego komputera nie próbuj rysować
                                            wszystkich nadajników<br />
                                            Nie udało mi się jeszcze zaimplementować kilku zapezpieczeń :)</h3>
                                        <Table
                                            system={this.state.system}
                                            callbackFromApp={this.getSelectedData}
                                            selected={this.state.selectedTransmitters}
                                            data={data} />
                                    </div>
                                }
                            </ModalDialog>
                        </ModalContainer>
                    : null
                }
                {
                    this.state.isShowingInfo ?
                        <ModalContainer>
                            <ModalDialog style={infoStyle} onClose={this.handleInfoClose}>
                                <Info showFull={this.state.showFullInfo} />
                            </ModalDialog>
                        </ModalContainer>
                        : null
                }
                <div className="shareWrapper">
                    <SystemButton id="share" class="share" title="Pobierz link do udostępnienia" value="" onSystemClick={this.handleShareClick} />
                </div>
                {
                    this.state.isShowingShare ?
                        <PopUp text={this.state.uri} />
                    : null
                }
                <div className="infoWrapper">
                    <SystemButton id="infoBtn" class="info" title="Informacje" value="i" onSystemClick={this.handleInfoClick} />
                </div>
                {
                    this.state.selectedSystemTransmitters.length ?
                        <LittleTable
                            system={this.state.system}
                            callbackFromApp={this.getDrawData}
                            selected={this.state.toDrawSelected}
                            data={this.state.selectedSystemTransmitters}
                            addTransmiter={this.state.isShowingModal} />
                    : null
                }
                {
                    <Map
                        selectedTransmitters={this.state.toDrawSelected}
                        selectedMarkers={this.state.selectedSystemTransmitters}
                        configuration={this.state.selectedConfiguration}
                        directional={this.state.directionalChecked}
                        system={this.state.system}
                        automaticZoom={this.state.automaticZoom} />
                }
            </div>
        );
    }
}

export default App;

// http://localhost:9000/l
// AIzaSyAZgc-xDQ-6Y9aDjj2GztoxTMSnRC6DioM
// http://localhost:9000/?config={%22tra%22:[{%22id%22:253},{%22id%22:312}],%22cfg%22:%22fm-std%22,%22sys%22:%22fm%22}
