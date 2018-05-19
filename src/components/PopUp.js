

import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import './../styles/PopUp.css';

function PopUp(props) {
    return (
        <div className="PopUpWrapper">
            <div className="PopUpContent">
                <input
                    id="shareInput"
                    type="text"
                    defaultValue={props.text} />
                <CopyToClipboard
                    text={props.text}
                    onCopy={() => {}}>
                    <button className="CopyToClip">Skopiuj do schowka</button>
                </CopyToClipboard>
            </div>
            <div className="PopUpTipContainer">
                <div className="PopUpTip" />
            </div>
        </div>
    );
}

export default PopUp;
