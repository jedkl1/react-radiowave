import React, { Component } from 'react';
import '../styles/ConfigurationsBox.css';
import Legend from './Legend';

import settingsIcon from '../../images/baseline_settings_black_36dp.png';

const settingsCheckboxesDesc = [
  {
    name: 'drawDirectionalChar',
    label: 'Rysuj charakterystyki kierunkowe anten',
  },
  {
    name: 'automaticZoom',
    label: 'Automatyczny zoom i wyśrodkowanie map',
  },
  {
    name: 'drawMultiple',
    label: 'Zezwól na rysowanie wielu map pokrycia.',
  },
];

class ConfigurationsBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      possibleConfigurations: [],
      checkedConfiguration: null,
      isOpen: false,
      automaticZoom: props.settings.automaticZoom,
      drawDirectionalChar: props.settings.drawDirectionalChar,
      drawMultiple: props.settings.drawMultiple,
    };
    this.getPossibleConfiguration = this.getPossibleConfiguration.bind(this);
    this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
    this.onSettingsChanged = this.onSettingsChanged.bind(this);
    this.openConfiguration = this.openConfiguration.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { system } = this.props;
    if (system !== prevProps.system) {
      this.getPossibleConfiguration(prevProps);
    }
  }

  componentDidMount() {
    this.getPossibleConfiguration();
  }

  getPossibleConfiguration(prevProps = undefined) {
    const { props } = this;

    if (!prevProps || props.system !== prevProps.system || !props.selected) {
      const possibleConfs = props.configurations.filter(
        (configuration) => (configuration.typ === props.system),
      );
      this.setState({ possibleConfigurations: possibleConfs, checkedConfiguration: possibleConfs[0] },
                    () => props.callbackFromApp(possibleConfs[0]));
    }
  }

  possibleConfRadios() {
    const { selected } = this.props;
    const { possibleConfigurations } = this.state;

    return possibleConfigurations.map((configuration) => (
      <React.Fragment key={configuration.nazwa}>
        <label htmlFor={configuration.cfg}>
          <input
            id={configuration.cfg}
            type="radio"
            name="configuration"
            checked={selected.cfg === configuration.cfg}
            value={configuration.cfg}
            onChange={this.onConfigurationChanged} />
          {configuration.nazwa}
        </label>
        <br />
      </React.Fragment>
    ));
  }

  onSettingsChanged(e) {
    const { target } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState({ [target.name]: value }, () => {
      const { settingsCallback } = this.props;
      const { automaticZoom, drawDirectionalChar, drawMultiple } = this.state;
      settingsCallback({ settings: { automaticZoom, drawDirectionalChar, drawMultiple } });
    });
  }

  settingsCheckboxes = () => {
    const { state } = this;

    return settingsCheckboxesDesc.map((checkbox) => (
      <React.Fragment key={checkbox.name}>
        <label key={checkbox.name} htmlFor={checkbox.name}>
          <input
            id={checkbox.name}
            type="checkbox"
            name={checkbox.name}
            checked={state[checkbox.name] === true}
            onChange={this.onSettingsChanged} />
          {checkbox.label}
        </label>
        <br />
      </React.Fragment>
    ));
  }

  onConfigurationChanged(e) {
    const { possibleConfigurations } = this.state;
    const { callbackFromApp } = this.props;

    const configur = possibleConfigurations.filter(
      (configuration) => configuration.cfg === e.target.value,
    );
    this.setState({ checkedConfiguration: configur[0] }, () => {
      const { checkedConfiguration } = this.state;
      callbackFromApp(checkedConfiguration);
    });
  }

  openConfiguration() {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  render() {
    const { state } = this;

    return state.possibleConfigurations.length ? (
      <div className="componentWidth">
        {state.isOpen ? (
          <div className={`confsBox ${state.isOpen}`}>
            <div className="ButtonHeaderWrap">
              <button
                type="button"
                onClick={this.openConfiguration}
                className="confsButton">
                <img
                  src={settingsIcon}
                  type="image/svg+xml"
                  className={`Conf-logo ${state.isOpen}`}
                  alt="Konfiguracja" />
              </button>
              <b className="WhiteParagraph">Ustawienia</b>
            </div>
            <div className="confsWhiteBox">
              <form>
                {this.possibleConfRadios()}
              </form>
              <b>{state.checkedConfiguration.opis}</b>
              {' '}
              <br />
              {' '}
              <br />
              {this.settingsCheckboxes()}
              <b className="label-margin-right" style={{ color: 'red' }}>
                UWAGA:
                {' '}
              </b>
              Może to spowodować spadek wydajności pracy Twojego urządzenia oraz
              jakości obserwacji map pokrycia.
            </div>
          </div>
        ) : (
          <div className={`confsBox ${state.isOpen}`}>
            <button
              type="button"
              onClick={this.openConfiguration}
              className="confsButton">
              <img
                src={settingsIcon}
                type="image/svg+xml"
                className={`Conf-logo ${state.isOpen}`}
                alt="Konfiguracja" />
            </button>
          </div>
        )}
        <Legend legend={state.checkedConfiguration} />
      </div>
    ) : null;
  }
}

export default ConfigurationsBox;
