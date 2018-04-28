

import React from 'react';

import './../styles/PopUp.css';

function PopUp(props) {
    console.log(props);

    return (
        <div className="PopUpWrapper">
            <div className="PopUpContent">
                <input
                    id="shareInput"
                    type="text"
                    defaultValue={props.text} />
            </div>
            <div className="PopUpTipContainer">
                <div className="PopUpTip" />
            </div>
        </div>
    );
}

export default PopUp;
