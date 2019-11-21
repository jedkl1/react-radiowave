import React from 'react';
import { Carousel } from 'react-bootstrap';

import './../styles/Info.css';

const systemImg = require('../../images/info/systems.jpeg');
const shareImg = require('../../images/info/share.jpeg');
const littleTableImg = require('../../images/info/littletable.jpeg');
const transmittersImg = require('../../images/info/transmitters.png');
const infoImg = require('../../images/info/info.png');
const confsImg = require('../../images/info/confs.jpeg');
const tableImg = require('../../images/info/table.jpeg');


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
                    <Carousel.Item>
                        <div className={'IntroImageWrapper first-slide'} />
                        <Carousel.Caption>
                            <h3>Zanim rozpoczniesz...</h3>
                            <p>Aplikacja Mapy RadioPolska udostępnia mapy pokrycia sygnałem z nadajników
                                radiowych i telewizyjnych w Polsce. Mapy te zostały policzone z wykorzystaniem
                                ogólnodostępnych narzędzi i zbiorów danych (Radio Mobile de Luxe, SRTM, wykazy UKE)
                                oraz dedykowanego własnego oprogramowania. Należy pamiętać, że mapy pokrycia sygnałem
                                nie są tożsame z mapami zasięgu, choć pewne podobieństwa występują.
                                Projekt ma charakter eksperymentalny, a do publikowanych wyników należy podchodzić z
                                rezerwą. Redakcja portalu RadioPolska ani autor aplikacji nie ponoszą odpowiedzialności
                                za konsekwencje wykorzystania prezentowanych tutaj wyników. Jędrzej Klocek i
                                Przemysław Korpas
                            </p>
                        </Carousel.Caption>
                    </Carousel.Item>
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
                            <h3>Wybierz mapy do narysowania</h3>
                            <p>Domyślnie możesz wyświetlić jedną mapę na raz, natomiast w konfiguracji możesz
                                zezwolić na wyświetlanie wielu map.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className={'IntroImageWrapper'}>
                            <img className={'IntroImage confs'} alt="ZmienKonfiguracjeImage" src={confsImg} />
                        </div>
                        <Carousel.Caption>
                            <h3>Ustawienia</h3>
                            <p>W tym oknie możesz zmienić konfigurację aplikacji. Kolejno: <br />
1. W niektórych przypadkach dostępne są różne warianty map dla tego samego systemu
- tutaj możesz dokonać szybkiego przełączenia pomiędzy wariantami. <br />
2. Możesz włączyć lub wyłączyć rysowanie charakterystyk kierunkowych anten
(w płaszczyźnie azymutalnej), które zostały uwzględnione w obliczeniach. <br />
3. Automatyczny zoom i wyśrodkowanie jest wygodny do szybkiego przeglądaniamap z różnych nadajników.
Jednak jeśli chcesz porównać pokrycie sygnałem z różnych nadajników na tym samym terenie, zalecamy
wyłączenie tej opcji. <br />
4. Możesz zezwolić na rysowanie wielu map pokrycia. Uwaga: przy wielu nakładających się mapach,
widok staje się nieczytelny, a poza tym przeglądarka może ulec zawieszeniu.
                            </p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className={'IntroImageWrapper'}>
                            <img className={'IntroImage'} alt="UdostepnijImage" src={shareImg} />
                        </div>
                        <Carousel.Caption>
                            <h3>Udostępnij</h3>
                            <p>Możesz wygenerować link do skonfigurowanego zestawu map i np. udostępnić go znajomym</p>
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
                Mapy RadioPolska beta version: 1.2.5
            </div>
        );
    }
}

export default Info;
