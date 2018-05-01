import React, { Component } from 'react';
import '../styles/Button.css';

class SystemButton extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onSystemClick(this.props.id);
    }

    render() {
        return (
            <div className="ButtonWrapper">
                <button
                    id={this.props.id}
                    className={`button ${this.props.class}`}
                    title={this.props.title}
                    onClick={this.handleClick}>
                    {this.props.value}</button>
            </div>
        );
    }
}

export default SystemButton;
