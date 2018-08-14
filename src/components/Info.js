import React from 'react';

import './../styles/Info.css';

const systemImg = require('../../images/info/system.png');
const shareImg = require('../../images/info/share.png');
const littleTableImg = require('../../images/info/littleTable.png');
const transmittersImg = require('../../images/info/transmitters.png');
// const infoImg = require('../../images/info/info.png');
const confsImg = require('../../images/info/confs.png');
const tableImg = require('../../images/info/table.png');


function InfoImage(props) {
    return (
        <div className="imgContainer">
            <img src={props.src} alt={props.alt} />
            <p>{props.hint}</p>
        </div>
    );
}

function Info() {
    return (
        <div>
            <h3> Witaj w aplikacji Mapy serwisu RadioPolska.pl</h3><br />
            <InfoImage
                src={systemImg}
                alt={'System info'}
                hint={'Wybierz system, w którym chcesz zbadać pokrycie'} />z
            <div className="imgContainer">
                <img src={transmittersImg} alt="Check transmitter info" />
                <p>Kliknij ten przycisk by przeszukać listę nadajników</p>
            </div>
            <div className="imgContainer">
                <img src={tableImg} alt="Table info" />
                <p>Zaznacz interesujące Cię nadajniki</p>
            </div>
            <div className="imgContainer">
                <img src={littleTableImg} alt="LittleTable info" />
                <p>W tej tabelce zaznacz docelowe nadajniki do narysowania</p>
            </div>
            {/* <div className="imgContainer">
                <img src={infoImg} alt="Information info img" />
                <p>Wróć tutaj</p>
            </div> */}
            <div className="imgContainer">
                <img src={confsImg} alt="Confs info" />
                <p>Zmieniaj konfiguracje map pokrycia</p>
            </div>
            <div className="imgContainer">
                <img src={shareImg} alt="Share info" />
                <p>Udostępnij swoje pomiary znajomym</p>
            </div>
            <h5> Aplikacja została wykonana jako przedmiot pracy inżynierskiej. </h5>
            <a> Jędrzej Klocek, </a>
            <a> Prowadzący pracę: dr inż. Przemysław Korpas, </a>
            <a> Politechnika Warszawska 2018 </a> <br />
            <a> Mapy-RadioPolska.pl beta version: 1.0.2 </a>

        </div>
    );
}

export default Info;
