

import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './../styles/PopUp.css';

class PopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
        };
    }

    copyClicked() {
        toast.success('Skopiowano do schowka', {
            position: toast.POSITION.BOTTOM_CENTER,
        });
    }

    render() {
        return (
            <div>
                <div className="PopUpWrapper">
                    <div className="PopUpContent">
                        <a href={this.props.text} target="_blank">{this.props.text}</a>
                        <CopyToClipboard
                            text={this.props.text}
                            onCopy={() => {}}>
                            <button
                                className="CopyToClip"
                                onClick={this.copyClicked}>
                    Skopiuj do schowka</button>
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
