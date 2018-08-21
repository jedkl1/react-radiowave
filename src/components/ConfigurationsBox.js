
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
            checkedDirectional: false,
            isOpen: null,
            automaticZoom: false,
            checkMultiple: false,
        };
        this.getPossibleConfiguration = this.getPossibleConfiguration.bind(this);
        this.directionalChanged = this.directionalChanged.bind(this);
        this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
        this.openConfiguration = this.openConfiguration.bind(this);
        this.zoomChanged = this.zoomChanged.bind(this);
        this.checkMultipleChanged = this.checkMultipleChanged.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.system !== prevProps.system) {
            this.getPossibleConfiguration(prevProps);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            checkedDirectional: nextProps.checkedDirectional,
            checkMultiple: nextProps.checkMultiple,
            automaticZoom: nextProps.automaticZoom,
        });
    }

    componentDidMount() {
        this.getPossibleConfiguration();
    }

    getPossibleConfiguration(prevProps) {
        const possibleConfs = [];
        // this.setState({ system: this.props.system });
        this.props.configurations.forEach((configuration) => {
            if (configuration.typ === this.props.system) {
                possibleConfs.push(configuration);
            }
        });
        if (this.props.selected && this.props.system === prevProps.system) {
            this.setState({ possibleConfigurations: possibleConfs,
                checkedConfiguration: this.props.selected }, () => { });
        } else if (!this.props.selected || this.props.system !== prevProps.system) {
            this.setState({ possibleConfigurations: possibleConfs,
                checkedConfiguration: possibleConfs[0] }, () => {
                this.props.callbackFromApp(this.state.checkedConfiguration);
            });
        }
    }

    returnPossibleRadio() {
        const radios = [];
        this.state.possibleConfigurations.forEach((configuration) => {
            if (configuration.cfg !== this.state.possibleConfigurations[0].cfg) {
                radios.push(
                    <input
                        id={configuration.cfg}
                        key={configuration.cfg}
                        type="radio"
                        name="configuration"
                        value={configuration.cfg}
                        onClick={this.onConfigurationChanged} />
                                , <label key={configuration.nazwa} htmlFor={configuration.cfg}>
                                    {configuration.nazwa}</label>);
            }
        });
        return radios;
    }

    onConfigurationChanged(e) {
        const configur = this.state.possibleConfigurations.filter(
            configuration => configuration.cfg === e.target.value);
        this.setState({ checkedConfiguration: configur[0] }, function () {
            this.props.callbackFromApp(this.state.checkedConfiguration);
        });
    }

    directionalChanged(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            checkedDirectional: value,
        }, function () {
            this.props.callbackDirectionals(
            this.state.checkedDirectional, this.state.automaticZoom, this.state.checkMultiple);
        });
    }

    zoomChanged(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            automaticZoom: value,
        }, function () {
            this.props.callbackDirectionals(
            this.state.checkedDirectional, this.state.automaticZoom, this.state.checkMultiple);
        });
    }

    checkMultipleChanged(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            checkMultiple: value,
        }, function () {
            this.props.callbackDirectionals(
                this.state.checkedDirectional, this.state.automaticZoom, this.state.checkMultiple);
        });
    }

    openConfiguration() { this.setState({ isOpen: !this.state.isOpen }); }

    render() {
        return (
            this.state.possibleConfigurations.length ?
                <div className={'componentWidth'}>
                    {
                        this.state.isOpen ?
                            <div className={`confsBox ${this.state.isOpen}`}>
                                <div className={'ButtonHeaderWrap'}>
                                    <button onClick={this.openConfiguration} className={'confsButton'}>
                                        <img src={settingsIcon} type="image/svg+xml" className={`Conf-logo ${this.state.isOpen}`} alt="Konfiguracja" />
                                    </button>
                                    <b className={'WhiteParagraph'}>Wybierz konfigurację mapy pokrycia</b>
                                </div>
                                <div className="confsWhiteBox">
                                    <form>
                                        <input
                                            type="radio"
                                            name="configuration"
                                            key={this.state.possibleConfigurations[0].cfg}
                                            id={this.state.possibleConfigurations[0].cfg}
                                            value={this.state.possibleConfigurations[0].cfg}
                                            defaultChecked
                                            onClick={this.onConfigurationChanged} />
                                        <label htmlFor={this.state.possibleConfigurations[0].cfg}>
                                            {this.state.possibleConfigurations[0].nazwa}
                                        </label>
                                        <br />
                                        {this.returnPossibleRadio()}
                                    </form>
                                    <b>{this.state.checkedConfiguration.opis}</b> <br /> <br />
                                    <input
                                        type="checkbox"
                                        name="directionalChars"
                                        id="directionalChars"
                                        value={this.state.checkedDirectional}
                                        checked={this.state.checkedDirectional}
                                        onChange={this.directionalChanged} />
                                    <label htmlFor="directionalChars">
                                    Rysuj charakterystyki kierunkowe anten
                                    </label> <br />
                                    <input
                                        type="checkbox"
                                        name="automatiZoom"
                                        id="automaticZoom"
                                        value={this.state.automaticZoom}
                                        checked={this.state.automaticZoom}
                                        onChange={this.zoomChanged} />
                                    <label htmlFor="automaticZoom">
                                    Automatyczny zoom i wyśrodkowanie map
                                    </label> <br />
                                    <input
                                        type="checkbox"
                                        name="checkMultiple"
                                        id="checkMultiple"
                                        value={this.state.checkMultiple}
                                        checked={this.state.checkMultiple}
                                        onChange={this.checkMultipleChanged} />
                                    <label htmlFor="checkMultiple">
                                        Zezwól na rysowanie wielu map pokrycia.
                                    </label> <br />
                                    <b style={{ color: 'red' }}>UWAGA: </b>
                                    Może to spowodować spadek wydajności pracy Twojego urządzenia
                                    oraz jakości obserwacji map pokrycia.
                                </div>
                            </div>
                        :
                            <div className={`confsBox ${this.state.isOpen}`}>
                                <button onClick={this.openConfiguration} className={'confsButton'}>
                                    <img src={settingsIcon} type="image/svg+xml" className={`Conf-logo ${this.state.isOpen}`} alt="Konfiguracja" />
                                </button>
                            </div>
                    }
                    <Legend legend={this.state.checkedConfiguration} />
                </div>
                : null
        );
    }

}

export default ConfigurationsBox;
