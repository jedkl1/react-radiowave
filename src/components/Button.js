import React, { Component } from 'react';
import '../styles/Button.css';


function Button(props) {
    return (
        <button
            id={props.id}
            className={`button ${props.class}`}
            title={props.title}
            onClick={props.onClick}>{props.value}</button>
    );
}

class SystemButton extends Component {

    constructor(props) {
        super(props);
        this.id = props.id;
        this.class = props.class;
        this.title = props.title;
        this.value = props.value;
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = () => {
        this.props.onSystemClick(this.props.value);
    }

    render() {
        return (
            <Button
                id={this.id}
                class={this.class}
                title={this.title}
                value={this.value}
                onClick={this.handleClick} />
        );
    }
}

export default SystemButton;
