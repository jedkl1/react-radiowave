

import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { ToastContainer, toast } from 'react-toastify';

import './../styles/PopUp.css';

class PopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
        };
    }

    // copyClicked() {
    //     toast.success('Skopiowano do schowka', {
    //         position: toast.POSITION.TOP_LEFT,
    //     });
    // }

    render() {
        return (
            <div>
                <div className="PopUpWrapper">
                    <div className="PopUpContent">
                        <a href={this.props.text}>{this.props.text}</a>
                        <CopyToClipboard
                            text={this.props.text}
                            onCopy={() => {}}>
                            <button
                                className="CopyToClip">
                    Skopiuj do schowka</button>
                        </CopyToClipboard>
                    </div>
                    <div className="PopUpTipContainer">
                        <div className="PopUpTip" />
                    </div>
                </div>
                {/* S<ToastContainer autoClose={1000} /> */}
            </div>
        );
    }
}

export default PopUp;
