import React, { Component } from 'react';
import '../styles/Button.css';

class SystemButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { id, onSystemClick } = this.props;
    onSystemClick(id);
  }

  render() {
    const { props } = this;
    return (
      <div className="ButtonWrapper">
        <button
          id={props.id}
          type="button"
          className={`button ${props.class}`}
          title={props.title}
          onClick={this.handleClick}>
          {props.value}
        </button>
      </div>
    );
  }
}

export default SystemButton;
