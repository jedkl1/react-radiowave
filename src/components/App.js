import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import queryString from 'query-string';

import '../styles/App.css';
import Map from './Map';
import SystemButton from './Button';
import Table from './Table/index';
import LittleTable from './LittleTable';
import ConfigurationsBox from './ConfigurationsBox';
import PopUp from './PopUp';
import Info from './Info';

import { fetchTransmittersBySystem, fetchAPIConfigurations, fetchTransmittersArray } from '../api/transmitters';
import { generateUrl, parseQueryToState } from '../helpers/url';
import { isValidSystem } from '../validators/url';

const logoIcon = require('../../images/icons/logoIcon.png').default;

let data = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingModal: false,
      // @TODO Info to true
      isShowingInfo: false,
      isShowingShare: false,
      selectedTransmitters: [],
      selectedSystemTransmitters: [],
      system: null,
      toDrawSelected: [],
      configurations: [],
      selectedConfiguration: null,
      openConfiguration: false,
      showFullInfo: true,
      settings: {
        automaticZoom: true,
        drawMultiple: false,
        drawDirectionalChar: true,
      },
    };
    this.handleSystemClick = this.handleSystemClick.bind(this);
    this.handleShareClick = this.handleShareClick.bind(this);
    this.handleInfoClick = this.handleInfoClick.bind(this);
    this.getConfigurations = this.getConfigurations.bind(this);
    this.getSelectedData = this.getSelectedData.bind(this);
    this.getDrawData = this.getDrawData.bind(this);
    this.getSelectedConfiguration = this.getSelectedConfiguration.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleInfoClose = this.handleInfoClose.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.checkQueryString = this.checkQueryString.bind(this);
    this.handleSettingsChanged = this.handleSettingsChanged.bind(this);
  }

  componentDidMount() {
    const { location } = this.props;

    if (location.search.length) {
      this.checkQueryString(location.search);
    } else {
      this.getConfigurations();
      this.setDefaultSystem();
    }
  }

  async componentDidUpdate(prevProps, prevStates) {
    const { system } = this.state;
    if (system !== prevStates.system) {
      data = await fetchTransmittersBySystem(system);
    }
  }

  async getConfigurations(configurationKey = 'fm-std') {
    const newState = await fetchAPIConfigurations(configurationKey);
    this.setState({ ...newState }, () => { });
  }

  checkQueryString(query) {
    const inputParams = queryString.parse(query);

    if (inputParams.sys) {
      this.setState(
        { ...parseQueryToState(inputParams) },
        () => {
          const ids = inputParams.tra.split(',');

          if (inputParams.sys && (isValidSystem(inputParams.sys))) {
            fetchTransmittersArray(ids, inputParams.sys)
              .then((transmitters) => {
                // removing undefined when something was wrong
                const filteredTransmitters = transmitters.filter((tra) => !!tra);

                if (filteredTransmitters.length > 0) {
                  this.setState({
                    selectedSystemTransmitters: filteredTransmitters,
                    selectedTransmitters: filteredTransmitters,
                    toDrawSelected: [filteredTransmitters[0]],
                  });
                }
              });
          } else {
            console.error('Error: niewłaściwe parametry wejściowe');
            this.getConfigurations();
            this.setDefaultSystem();
          }
        },
      );
    }
    if (inputParams.cfg) {
      this.setConfiguration(inputParams.cfg);
    } else {
      this.getConfigurations();
    }
  }

  setDefaultSystem() {
    this.setState({ system: 'fm' });
  }

  setConfiguration(configurationString) {
    this.getConfigurations(configurationString);
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
    this.setState(
      { system: id, selectedSystemTransmitters: currentTransmitters },
      () => { },
    );
  }

  handleShareClick() {
    const url = generateUrl(this.state);
    this.setState((prevState) => ({ uri: url, isShowingShare: !prevState.isShowingShare }));
  }

  handleSettingsChanged(newState) {
    this.setState({ ...newState, isShowingShare: false });
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
        () => { },
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
      () => { },
    );
  }

  getSelectedConfiguration(dataFromConfiguration) {
    this.setState({
      selectedConfiguration: dataFromConfiguration,
      isShowingShare: false,
    });
  }

  systemButtonFocusClass(system, shouldBeSystem) {
    let className = 'system';
    if (system === shouldBeSystem) className += ' focus';
    return className;
  }

  render() {
    const domain = window.location.port.length
      ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}${window.location.pathname}`
      : `${window.location.protocol}//${window.location.hostname}${window.location.pathname}`;

    const { state } = this;
    return (
      <div id="gridId" className="grid">
        <div id="systems_container" className="container systems">
          <SystemButton
            id="fm"
            class={this.systemButtonFocusClass(state.system, 'fm')}
            title="Zmień system na FM"
            value="FM"
            onSystemClick={this.handleSystemClick} />
          <SystemButton
            id="dab"
            class={this.systemButtonFocusClass(state.system, 'dab')}
            title="Zmień system na DAB+"
            value="DAB+"
            onSystemClick={this.handleSystemClick} />
          <SystemButton
            id="dvbt"
            class={this.systemButtonFocusClass(state.system, 'dvbt')}
            title="Zmień system na DVB-T"
            value="DVB-T"
            onSystemClick={this.handleSystemClick} />
        </div>
        <a href={domain}>
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
              isOpen={state.openConfiguration}
              configurations={state.configurations}
              settings={state.settings}
              settingsCallback={this.handleSettingsChanged}
              selected={state.selectedConfiguration}
              callbackFromApp={this.getSelectedConfiguration} />
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
            checkMultiple={state.settings.drawMultiple}
            addTransmiter={state.isShowingModal} />
        ) : null}
        {
          <Map
            selectedTransmitters={state.toDrawSelected}
            selectedMarkers={state.selectedSystemTransmitters}
            configuration={state.selectedConfiguration}
            directional={state.settings.drawDirectionalChar}
            system={state.system}
            automaticZoom={state.settings.automaticZoom} />
        }
      </div>
    );
  }
}

export default App;
