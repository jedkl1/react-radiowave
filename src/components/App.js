import React, { Component } from 'react';
// import Modal from 'react-modal';
import { Modal } from 'react-bootstrap';
import queryString from 'query-string';

import '../styles/App.css';
import Map from './Map';
import SystemButton from './Button';
import Table from './Table';
import LittleTable from './LittleTable';
import ConfigurationsBox from './ConfigurationsBox';
import PopUp from './PopUp';
import Info from './Info';

const logoIcon = require('../../images/icons/logoIcon.png').default;

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
      directionalChecked: true,
      openConfiguration: false,
      showFullInfo: true,
      automaticZoom: true,
      checkMultiple: false,
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
    this.getDirectionalCheckedStatus = this.getDirectionalCheckedStatus.bind(
      this,
    );
    this.handleClose = this.handleClose.bind(this);
    this.handleInfoClose = this.handleInfoClose.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.checkQueryString = this.checkQueryString.bind(this);
    this.zoomChanged = this.zoomChanged.bind(this);
    this.directionalChanged = this.directionalChanged.bind(this);
    this.checkMultipleChanged = this.checkMultipleChanged.bind(this);
  }

  getConfigurations(configurationString = 'fm-std') {
    const { configurations } = this.state;
    fetch('https://mapy.radiopolska.pl/api/cfg')
      .then((res) => res.json())
      .then(
        (res) => {
          this.setState({ configurations: res.data }, function () {
            configurations.forEach((configuration) => {
              if (configuration.cfg === configurationString) {
                this.setState(
                  { selectedConfiguration: configuration },
                  () => {},
                );
              }
            });
          });
        },
        // (error) => {
        //     console.log(`Error: ${error}`);
        // },
      );
  }

  /* eslint-disable camelcase */
  // UNSAFE_componentWillMount() {
  //   Modal.setAppElement('body');
  // }

  componentDidMount() {
    this.checkQueryString();
  }

  checkQueryString() {
    const { location } = this.props;
    if (location.search) {
      // ?name=ferret&color=purple
      const inputParams = queryString.parse(location.search);

      if (inputParams.m) {
        this.setState({
          checkMultiple: inputParams.m === 'true',
        });
      }
      if (inputParams.z) {
        this.setState({
          automaticZoom: inputParams.z === 'true',
        });
      }
      if (inputParams.d) {
        this.setState({
          directionalChecked: inputParams.d === 'true',
        });
      }

      if (inputParams.sys) {
        this.setState(
          {
            system: inputParams.sys,
          },
          () => {
            console.log('Input params are set');
            const transmitters = inputParams.tra.split(',');
            transmitters.forEach((transmitter) => {
              if (Number.isNaN(Number(transmitter))) {
                console.error(
                  `Error: niewłaściwy ${transmitter} numer nadajnika`,
                );
              } else if (
                inputParams.sys
                && (inputParams.sys === 'dab'
                  || inputParams.sys === 'fm'
                  || inputParams === 'dvbt')
              ) {
                fetch(
                  `https://mapy.radiopolska.pl/api/transmitterById/pl/${inputParams.sys}/${transmitter}`,
                )
                  .then((res) => res.json())
                  .then(
                    (res) => {
                      const {
                        selectedSystemTransmitters,
                        selectedTransmitters,
                        toDrawSelected,
                      } = this.state;
                      const tempArray = selectedTransmitters.slice();
                      if (res.data.length) {
                        tempArray.push(res.data[0]);
                        let selected = toDrawSelected;
                        if (selected.length) {
                          selected = toDrawSelected;
                        } else {
                          selected = [res.data[0]];
                        }
                        this.setState(
                          {
                            selectedTransmitters: tempArray,
                            toDrawSelected: selected,
                            selectedSystemTransmitters: tempArray,
                            showFullInfo: false,
                          },
                          () => {
                            console.log(selectedTransmitters);
                          },
                        );
                      } else {
                        console.log(
                          `Error brak ${transmitter} nadajnika w bazie danych`,
                        );
                        this.setState(
                          {
                            selectedTransmitters,
                            selectedSystemTransmitters,
                            showFullInfo: true,
                          },
                          () => {
                            console.log(selectedTransmitters);
                          },
                        );
                      }
                    },
                    (error) => {
                      console.log(`Error: ${error}`);
                    },
                  );
              } else {
                console.error('Error: niewłaściwe parametry wejściowe');
                this.getConfigurations();
                this.setSystems(false);
              }
            });
          },
        );
      }
      if (inputParams.cfg) {
        this.setConfiguration(inputParams.cfg);
      } else {
        this.getConfigurations();
      }
    } else {
      this.getConfigurations();
      this.setSystems(false);
    }
  }

  componentDidUpdate(prevProps, prevStates) {
    const { system } = this.state;
    if (system !== prevStates.system) {
      let dataUrl = 'https://mapy.radiopolska.pl/api/transmitterAll/pl/';
      if (system === 'fm') {
        dataUrl += 'fm';
      } else if (system === 'dab') {
        dataUrl += 'dab';
      } else if (system === 'dvbt') {
        dataUrl += 'dvbt';
      }
      // console.log(dataUrl);
      fetch(dataUrl)
        .then((res) => res.json())
        .then(
          (res) => {
            data = res.data;
          },
          (error) => {
            console.log(`Error: ${error}`);
          },
        );
    }
  }

  setSystems(params = false) {
    if (params) {
      this.setState({ system: params }, () => {});
    } else {
      this.setState({ system: 'fm' }, () => {});
    }
  }

  setConfiguration(configurationString) {
    this.getConfigurations(configurationString);
  }

  setZoom(isAutomatic) {
    this.setState({ automaticZoom: isAutomatic }, () => {});
  }

  setMultiple(isMultiple) {
    this.setState({ checkMultiple: isMultiple }, () => {});
  }

  setDirectional(isDirectional) {
    this.setState({ directionalChecked: isDirectional }, () => {});
  }

  handleSystemClick(id) {
    const { selectedTransmitters, system } = this.state;
    if (system !== id) {
      data = [];
    }

    const currentTransmitters = [];
    selectedTransmitters.forEach((element) => {
      if (element.typ === id) {
        currentTransmitters.push(element);
      }
    });
    if (id === 'fm') {
      this.setState(
        { fmClicked: true, dabClicked: false, dvbtClicked: false },
        () => {},
      );
    } else if (id === 'dab') {
      this.setState(
        { fmClicked: false, dabClicked: true, dvbtClicked: false },
        () => {},
      );
    } else if (id === 'dvbt') {
      this.setState(
        { fmClicked: false, dabClicked: false, dvbtClicked: true },
        () => {},
      );
    }
    this.setState(
      { system: id, selectedSystemTransmitters: currentTransmitters },
      () => {},
    );
  }

  handleRefreshClick() {}

  handleShareClick() {
    const {
      selectedConfiguration,
      toDrawSelected,
      system,
      automaticZoom,
      checkMultiple,
      directionalChecked,
      isShowingShare,
    } = this.state;
    if (selectedConfiguration) {
      // ?name=ferret&color=purple
      const domain = window.location.port.length
        ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}${window.location.pathname}`
        : `${window.location.protocol}//${window.location.hostname}${window.location.pathname}`;
      let url = domain;
      if (toDrawSelected.length) {
        url += '?tra=';
        url += toDrawSelected
          .map((element) => `${element.id_nadajnik}`)
          .join(',');
        url += `&cfg=${selectedConfiguration.cfg}&`;
        url += `sys=${system}&`;
        url += `z=${automaticZoom}&`;
        url += `m=${checkMultiple}&`;
        url += `d=${directionalChecked}`;
      }
      this.setState({ uri: url, isShowingShare: !isShowingShare }, () => {});
    }
  }

  directionalChanged(e) {
    const { target } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      directionalChecked: value,
      isShowingShare: false,
    });
  }

  zoomChanged(e) {
    const { target } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      automaticZoom: value,
      isShowingShare: false,
    });
  }

  checkMultipleChanged(e) {
    const { target } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      checkMultiple: value,
      isShowingShare: false,
    });
  }

  openDialog() {
    this.setState({ isShowingModal: true });
  }

  handleClose() {
    this.setState({ isShowingModal: false });
  }

  handleInfoClose() {
    this.setState({ isShowingInfo: false, showFullInfo: true });
  }

  handleInfoClick() {
    this.setState({ isShowingInfo: true });
  }

  getSelectedData(dataFromTable) {
    this.setState({ selectedTransmitters: dataFromTable }, () => {
      const { selectedTransmitters, system, toDrawSelected } = this.state;
      const currentTransmitters = [];
      selectedTransmitters.forEach((element) => {
        if (element.typ === system) {
          currentTransmitters.push(element);
        }
      });
      const intersection = currentTransmitters.filter((transmitter) => toDrawSelected.includes(transmitter));
      this.setState(
        {
          selectedSystemTransmitters: currentTransmitters,
          toDrawSelected: intersection,
          isShowingShare: false,
        },
        () => {},
      );
    });
  }

  getDrawData(dataFromLittleTable, openTable) {
    this.setState(
      {
        toDrawSelected: dataFromLittleTable,
        isShowingModal: openTable,
        isShowingShare: false,
      },
      () => {},
    );
  }

  getSelectedConfiguration(dataFromConfiguration) {
    this.setState({
      selectedConfiguration: dataFromConfiguration,
      isShowingShare: false,
    });
  }

  getDirectionalCheckedStatus(
    dataFromConfiguration,
    automaticZoom,
    checkMultipleArgs,
  ) {
    const { checkMultiple } = this.state;
    if (checkMultiple !== checkMultipleArgs) {
      this.setState({
        directionalChecked: dataFromConfiguration,
        automaticZoom,
        checkMultiple: checkMultipleArgs,
        toDrawSelected: [],
      });
    } else {
      this.setState({
        directionalChecked: dataFromConfiguration,
        automaticZoom,
      });
    }
  }

  render() {
    const domain = window.location.port.length
      ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}${window.location.pathname}`
      : `${window.location.protocol}//${window.location.hostname}${window.location.pathname}`;

    const { state } = this;
    return (
      <div id="gridId" className="grid">
        <div id="systems_container" className="container systems">
          {state.fmClicked ? (
            <SystemButton
              id="fm"
              class="system focus"
              title="Zmień system na FM"
              value="FM"
              onSystemClick={this.handleSystemClick} />
          ) : (
            <SystemButton
              id="fm"
              class="system"
              title="Zmień system na FM"
              value="FM"
              onSystemClick={this.handleSystemClick} />
          )}
          {state.dabClicked ? (
            <SystemButton
              id="dab"
              class="system focus"
              title="Zmień system na DAB+"
              value="DAB+"
              onSystemClick={this.handleSystemClick} />
          ) : (
            <SystemButton
              id="dab"
              class="system"
              title="Zmień system na DAB+"
              value="DAB+"
              onSystemClick={this.handleSystemClick} />
          )}
          {state.dvbtClicked ? (
            <SystemButton
              id="dvbt"
              class="system focus"
              title="Zmień system na DVB-T"
              value="DVB-T"
              onSystemClick={this.handleSystemClick} />
          ) : (
            <SystemButton
              id="dvbt"
              class="system"
              title="Zmień system na DVB-T"
              value="DVB-T"
              onSystemClick={this.handleSystemClick} />
          )}
        </div>
        <a href={domain}>
          {' '}
          {/* page must stay on https */}
          <img id="home" className="button home" alt="Odswiez" src={logoIcon} />
        </a>
        <div className="stationsWrapper ButtonWrapper">
          <button
            id="stations"
            type="button"
            aria-label="check station button"
            className="button checkStation"
            title="Wybierz stacje do narysowania pokrycia"
            value=""
            onClick={this.openDialog} />
        </div>
        <div id="buttons_container" className="container buttons">
          {state.configurations.length ? (
            <ConfigurationsBox
              system={state.system}
              automaticZoom={state.automaticZoom}
              checkMultiple={state.checkMultiple}
              zoomChanged={this.zoomChanged}
              directionalChanged={this.directionalChanged}
              checkMultipleChanged={this.checkMultipleChanged}
              directionalChecked={state.directionalChecked}
              isOpen={state.openConfiguration}
              configurations={state.configurations}
              selected={state.selectedConfiguration}
              callbackFromApp={this.getSelectedConfiguration}
              callbackDirectionals={this.getDirectionalCheckedStatus} />
          ) : null}
        </div>
        <Modal show={state.isShowingModal} size="xl" onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title> Wybierz nadajniki</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table
              system={state.system}
              callbackFromApp={this.getSelectedData}
              selected={state.selectedTransmitters}
              data={data} />
          </Modal.Body>
        </Modal>
        <Modal
          show={state.isShowingInfo}
          size="xl"
          onHide={this.handleInfoClose}>
          <Info showFull={state.showFullInfo} />
        </Modal>
        <div className="shareWrapper">
          <SystemButton
            id="share"
            class="share"
            title="Pobierz link do udostępnienia"
            value=""
            onSystemClick={this.handleShareClick} />
        </div>
        {state.isShowingShare ? <PopUp text={state.uri} /> : null}
        <div className="infoWrapper">
          <SystemButton
            id="infoBtn"
            class="info"
            title="Informacje"
            value="i"
            onSystemClick={this.handleInfoClick} />
        </div>
        {state.selectedSystemTransmitters.length ? (
          <LittleTable
            system={state.system}
            callbackFromApp={this.getDrawData}
            selected={state.toDrawSelected}
            data={state.selectedSystemTransmitters}
            checkMultiple={state.checkMultiple}
            addTransmiter={state.isShowingModal} />
        ) : null}
        {
          <Map
            selectedTransmitters={state.toDrawSelected}
            selectedMarkers={state.selectedSystemTransmitters}
            configuration={state.selectedConfiguration}
            directional={state.directionalChecked}
            system={state.system}
            automaticZoom={state.automaticZoom} />
        }
      </div>
    );
  }
}

export default App;

// http://localhost:9000/l
// AIzaSyAZgc-xDQ-6Y9aDjj2GztoxTMSnRC6DioM
// http://localhost:9000/?config={%22tra%22:[{%22id%22:253},{%22id%22:312}],%22cfg%22:%22fm-std%22,%22sys%22:%22fm%22}
