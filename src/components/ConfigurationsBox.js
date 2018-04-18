
import React, { Component } from 'react';
import '../styles/ConfigurationsBox.css';
import Legend from './Legend';

class ConfigurationsBox extends Component {


    constructor(props) {
        super(props);
        this.state = {
            possibleConfigurations: [],
            checkedConfiguration: null,
        };
        this.getPossibleConfiguration = this.getPossibleConfiguration.bind(this);
        this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.system !== prevProps.system) {
            this.getPossibleConfiguration(prevProps);
        }
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
                checkedConfiguration: this.props.selected }, () => {
                console.log(this.state.possibleConfigurations);
            });
        } else if (!this.props.selected) {
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
                radios.push(<input
                    key={configuration.cfg}
                    type="radio"
                    name="configuration"
                    value={configuration.cfg}
                    onClick={this.onConfigurationChanged} />
                                , configuration.nazwa, <br />);
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

    render() {
        return (
            this.state.possibleConfigurations.length ?
                <div>
                    <div className="confsBox">
                        <b>Wybierz konfigurację mapy pokrycia</b>
                        <form>
                            <input
                                type="radio"
                                name="configuration"
                                key={this.state.possibleConfigurations[0].cfg}
                                value={this.state.possibleConfigurations[0].cfg}
                                defaultChecked
                                onClick={this.onConfigurationChanged} />
                            {this.state.possibleConfigurations[0].nazwa} <br />
                            {this.returnPossibleRadio()}
                        </form>
                        <br />
                        <b>{this.state.checkedConfiguration.opis}</b>
                    </div>
                    <Legend legend={this.state.checkedConfiguration} />
                </div>
                : null
        );
    }

}

export default ConfigurationsBox;
