import React, { Component } from 'react';
import '../styles/ConfigurationsBox.css';
import Legend from './Legend';

import settingsIcon from '../../images/baseline_settings_black_36dp.png';

class ConfigurationsBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      possibleConfigurations: [],
      checkedConfiguration: null,
      isOpen: false,
    };
    this.getPossibleConfiguration = this.getPossibleConfiguration.bind(this);
    this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
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

  getPossibleConfiguration(prevProps) {
    const { props } = this;
    const possibleConfs = [];

    props.configurations.forEach((configuration) => {
      if (configuration.typ === props.system) {
        possibleConfs.push(configuration);
      }
    });
    if (props.selected && props.system === prevProps.system) {
      this.setState(
        {
          possibleConfigurations: possibleConfs,
          checkedConfiguration: props.selected,
        },
        () => {},
      );
    } else if (!props.selected || props.system !== prevProps.system) {
      this.setState(
        {
          possibleConfigurations: possibleConfs,
          checkedConfiguration: possibleConfs[0],
        },
        () => {
          const { checkedConfiguration } = this.state;
          props.callbackFromApp(checkedConfiguration);
        },
      );
    }
  }

  returnPossibleRadio() {
    const { selected } = this.props;
    const { possibleConfigurations } = this.state;
    const radios = [];

    possibleConfigurations.forEach((configuration) => {
      if (configuration.cfg !== possibleConfigurations[0].cfg) {
        radios.push(
          <input
            id={configuration.cfg}
            key={configuration.cfg}
            type="radio"
            name="configuration"
            checked={selected.cfg === configuration.cfg}
            value={configuration.cfg}
            onChange={this.onConfigurationChanged} />,
          <label key={configuration.nazwa} htmlFor={configuration.cfg}>
            {configuration.nazwa}
          </label>,
        );
      }
    });
    return radios;
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
    const { props } = this;
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
                <input
                  type="radio"
                  name="configuration"
                  key={state.possibleConfigurations[0].cfg}
                  id={state.possibleConfigurations[0].cfg}
                  checked={
                    props.selected.cfg === state.possibleConfigurations[0].cfg
                  }
                  value={state.possibleConfigurations[0].cfg}
                  onChange={this.onConfigurationChanged} />
                <label htmlFor={state.possibleConfigurations[0].cfg}>
                  {state.possibleConfigurations[0].nazwa}
                </label>
                <br />
                {this.returnPossibleRadio()}
              </form>
              <b>{state.checkedConfiguration.opis}</b>
              {' '}
              <br />
              {' '}
              <br />
              <label htmlFor="directionalChars">
                <input
                  type="checkbox"
                  name="directionalChars"
                  id="directionalChars"
                  checked={props.directionalChecked === true}
                  onChange={props.directionalChanged} />
                Rysuj charakterystyki kierunkowe anten
              </label>
              {' '}
              <br />
              <label htmlFor="automaticZoom">
                <input
                  type="checkbox"
                  name="automatiZoom"
                  id="automaticZoom"
                  checked={props.automaticZoom === true}
                  onChange={props.zoomChanged} />
                {' '}
                Automatyczny zoom i wyśrodkowanie map
              </label>
              {' '}
              <br />
              <label className="label-without-margin" htmlFor="checkMultiple">
                <input
                  type="checkbox"
                  name="checkMultiple"
                  id="checkMultiple"
                  checked={props.checkMultiple === true}
                  onChange={props.checkMultipleChanged} />
                Zezwól na rysowanie wielu map pokrycia.
              </label>
              {' '}
              <br />
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
