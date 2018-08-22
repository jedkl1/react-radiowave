import React from 'react';
import { Carousel } from 'react-bootstrap';

import './../styles/Info.css';

const systemImg = require('../../images/info/system.png');
const shareImg = require('../../images/info/share.png');
const littleTableImg = require('../../images/info/littleTable.png');
const transmittersImg = require('../../images/info/transmitters.png');
const infoImg = require('../../images/info/info.png');
const confsImg = require('../../images/info/confs.png');
const tableImg = require('../../images/info/table.png');


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

        const full = (<div>
            <Carousel.Item>
                <div className={'IntroImageWrapper'}>
                    <img className={'IntroImage'} alt="WyborSystemuImage" src={systemImg} />
                </div>
                <Carousel.Caption>
                    <h3>Wybór systemu</h3>
                    <p>Wybierz system, w którym chcesz zbadać pokrycie</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <div className={'IntroImageWrapper'}>
                    <img className={'IntroImage'} alt="WyborNadajnikowImage" src={transmittersImg} />
                </div>
                <Carousel.Caption>
                    <h3>Przeszukaj nadajniki</h3>
                    <p>Kliknij ten przycisk by przejrzeć listę nadajników.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <div className={'IntroImageWrapper'}>
                    <img className={'IntroImage'} alt="WyborNadajnikaImage" src={tableImg} />
                </div>
                <Carousel.Caption>
                    <h3>Wybierz nadajniki</h3>
                    <p>Przeszukuj tabelkę i zaznacz interesujące Cię pozycje.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </div>);

        return (
            <div>
                <h3> Witaj w aplikacji Mapy serwisu RadioPolska.pl</h3>
                <Carousel
                    activeIndex={index}
                    direction={direction}
                    onSelect={this.handleSelect}>
                    {
                        this.props.showFull ?
                            full.props.children
                        :
                        null
                    }

                    <Carousel.Item>
                        <div className={'IntroImageWrapper'}>
                            <img className={'IntroImage'} alt="RysujNadajnikiImage" src={littleTableImg} />
                        </div>
                        <Carousel.Caption>
                            <h3>Rysuj nadajniki</h3>
                            <p>Wybieraj nadajniki by narysować je na mapie.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className={'IntroImageWrapper'}>
                            <img className={'IntroImage'} alt="ZmienKonfiguracjeImage" src={confsImg} />
                        </div>
                        <Carousel.Caption>
                            <h3>Zmień konfigurację</h3>
                            <p>Wejdź tutaj by zmieniać konfiguracje map.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className={'IntroImageWrapper'}>
                            <img className={'IntroImage'} alt="UdostepnijImage" src={shareImg} />
                        </div>
                        <Carousel.Caption>
                            <h3>Udostępnij</h3>
                            <p>Udostępniaj swoje mapy znajomym.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className={'IntroImageWrapper'}>
                            <img className={'IntroImage'} alt="WrocTutajImage" src={infoImg} />
                        </div>
                        <Carousel.Caption>
                            <h3>Instrukcja</h3>
                            <p>Kliknij ten przycisk by wrócić do tej instrukcji.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
                <h5> Aplikacja została wykonana jako przedmiot pracy inżynierskiej. </h5>
                Autor: Jędrzej Klocek, opiekun: dr inż. Przemysław Korpas,
                Politechnika Warszawska 2018 <br />
                Mapy-RadioPolska.pl beta version: 1.2.1
            </div>
        );
    }
}

export default Info;
