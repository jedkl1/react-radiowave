import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/PopUp.css';

class PopUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  copyClicked() {
    toast.success('Skopiowano do schowka', {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }

  render() {
    const { text } = this.props;

    return (
      <div>
        <div className="PopUpWrapper">
          <div className="PopUpContent">
            <a href={text} target="_blank" rel="noopener noreferrer">
              {text}
            </a>
            <CopyToClipboard text={text} onCopy={() => {}}>
              <button
                className="CopyToClip"
                type="button"
                onClick={this.copyClicked}>
                Skopiuj do schowka
              </button>
            </CopyToClipboard>
          </div>
          <div className="PopUpTipContainer">
            <div className="PopUpTip" />
          </div>
        </div>
        <ToastContainer autoClose={2000} />
      </div>
    );
  }
}

export default PopUp;
