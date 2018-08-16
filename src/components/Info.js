import React from 'react';
import { Carousel } from 'react-bootstrap';

import './../styles/Info.css';

const systemImg = require('../../images/info2/system.png');
const shareImg = require('../../images/info2/share.png');
const littleTableImg = require('../../images/info2/littleTable.png');
// const transmittersImg = require('../../images/info/transmitters.png');
// const infoImg = require('../../images/info/info.png');
// const confsImg = require('../../images/info/confs.png');
// const tableImg = require('../../images/info/table.png');


// function InfoImage(props) {
//     return (
//         <div className="imgContainer">
//             <img src={props.src} alt={props.alt} />
//             <p>{props.hint}</p>
//         </div>
//     );
// }

class Info extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            index: 0,
            direction: null,
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(selectedIndex, e) {
        // alert(`selected=${selectedIndex}, direction=${e.direction}`);
        this.setState({
            index: selectedIndex,
            direction: e.direction,
        });
    }

    render() {
        const { index, direction } = this.state;

        return (
            <div>
                {/* <h3> Witaj w aplikacji Mapy serwisu RadioPolska.pl</h3><br />
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
            </div>asd
            <div className="imgContainer">
                <img src={littleTableImg} alt="LittleTable info" />
                <p>W tej tabelce zaznacz docelowe nadajniki do narysowania</p>
            </div>
            { <div className="imgContainer">
                <img src={infoImg} alt="Information info img" />
                <p>Wróć tutaj</p>
            </div> }
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
            <a> Mapy-RadioPolska.pl beta version: 1.0.2 </a> */}
                <h3> Witaj w aplikacji Mapy serwisu RadioPolska.pl</h3>
                <Carousel
                    activeIndex={index}
                    direction={direction}
                    onSelect={this.handleSelect}>
                    <Carousel.Item>
                        <img width={1310} height={600} alt="400x300" src={systemImg} />
                        <Carousel.Caption>
                            <h3>Przyciski wyboru systemu</h3>
                            <p>Wybierz system, w którym chcesz zbadać pokrycie</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={1310} height={600} alt="400x300" src={shareImg} />
                        <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={1310} height={600} alt="400x300" src={littleTableImg} />
                        <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
                <h5> Aplikacja została wykonana jako przedmiot pracy inżynierskiej. </h5>
                <a> Jędrzej Klocek, </a>
                <a> Prowadzący pracę: dr inż. Przemysław Korpas, </a>
                <a> Politechnika Warszawska 2018 </a> <br />
                <a> Mapy-RadioPolska.pl beta version: 1.0.2 </a>
            </div>
        );
    }
}

export default Info;
