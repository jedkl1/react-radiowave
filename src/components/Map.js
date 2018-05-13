import React, { Component } from 'react';
import L from 'leaflet';

// postCSS import of Leaflet's CSS
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';

const icon = require('../../images/antenna-3-marker.png');

const parseString = require('react-native-xml2js').parseString;

/* eslint no-underscore-dangle: 0 */

// store the map configuration properties in an object,
// we could also move this to a separate file & import it if desired.
const config = {};
config.params = {
    center: [52.1, 20.3],
    zoomControl: false,
    zoom: 7,
    maxZoom: 18,
    minZoom: 5,
};
config.tileLayer = {
    uri: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    params: {
        minZoom: 5,
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        id: '',
        accessToken: '',
    },
};
config.myIcon = L.icon({
    iconUrl: icon,
    iconSize: [30, 65],
    // iconAnchor: [22, 94],
    popupAnchor: [0, -36],
});

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            tileLayer: null,
            selectedTransmitters: props.selectedTransmitters,
            markers: [],
            directionalChars: [],
            layersGroup: [],
            geoLat: null,
            geoLon: null,
        };
        this.mapNode = null;
        // this.setView = this.setView.bind(this);
    }

    componentDidMount() {
    // create the Leaflet map object
        if (!this.state.map) this.init(this.mapNode);
        navigator.geolocation.getCurrentPosition((e) => {
            this.setState({
                geoLat: e.coords.latitude, geoLon: e.coords.longitude }, () => {
                const marker = L.marker([this.state.geoLat, this.state.geoLon],
                        { icon: config.myIcon }).addTo(this.state.map);
                marker.bindPopup(
                    'Twoja pozycja');
            });
        });
    }

    componentDidUpdate(prevProps) {
    // code to run when the component receives new props or state
        if (this.props.selectedTransmitters !== prevProps.selectedTransmitters ||
            this.props.configuration !== prevProps.configuration || this.props.directional !== prevProps.directional) {
            this.state.selectedTransmitters = this.props.selectedTransmitters;
            this.layersGroup.clearLayers();
            this.state.markers.forEach((element) => { this.state.map.removeLayer(element); });
            this.state.markers = [];
            this.state.directionalChars.forEach((element) => { this.state.map.removeLayer(element); });
            this.state.directionalChars = [];
            this.state.selectedTransmitters.forEach((element) => {
                fetch(`https://mapy.radiopolska.pl/files/get/${this.props.configuration.cfg}/${element._mapahash}.kml`)
                    .then(res => res.text())
                    .then(
                        (res) => {
                            parseString(res, (err, result) => {
                                const tempKml = result.kml.GroundOverlay[0];
                                this.addLayer(tempKml, `${element._mapahash}.png`);
                            });
                        },
                        // (error) => {
                        //     console.log(`Error${error}`);
                        // },
                    );
            });
            if (prevProps.configuration === this.props.configuration) {
                this.setView();
            }
        }
    }

    componentWillUnmount() {
    // code to run just before unmounting the component
    // this destroys the Leaflet map object & related event listeners
        this.state.map.remove();
    }

    addLayer(kml, png) {
        const boundsArray = [];

        boundsArray.push(Number(kml.LatLonBox[0].east[0]) - 0.008);
        boundsArray.push(Number(kml.LatLonBox[0].north[0]) - 0.035);
        boundsArray.push(Number(kml.LatLonBox[0].south[0]) - 0.035);
        boundsArray.push(Number(kml.LatLonBox[0].west[0]) - 0.008);

        const imageBounds = [[boundsArray[2], boundsArray[3]], [boundsArray[1], boundsArray[0]]];
        this.layersGroup.addLayer(L.imageOverlay(`https://mapy.radiopolska.pl/files/get/${this.props.configuration.cfg}/${png}`, imageBounds, { opacity: 0.6 }));
        if (this.props.directional) {
            this.addDirectionalChar();
        }
        this.addMarkers();
    }

    addDirectionalChar() {
        this.state.directionalChars.forEach((marker) => { this.state.map.removeLayer(marker); });
        this.setState({ directionalChars: [] }, () => { });
        this.state.selectedTransmitters.forEach((element) => {
            const tempArray = this.state.directionalChars.slice();
            const marker = L.marker([element.szerokosc, element.dlugosc],
                                    { icon: L.icon({
                                        iconUrl: `https://mapy.radiopolska.pl/files/ant_pattern/${element.id_antena}`,
                                        iconSize: [130, 130],
                                    }) }).addTo(this.state.map);
            tempArray.push(marker);
            this.setState({ directionalChars: tempArray }, () => { });
        });
    }

    addMarkers() {
        this.state.markers.forEach((marker) => { this.state.map.removeLayer(marker); });
        this.setState({ markers: [] }, () => { });
        this.state.selectedTransmitters.forEach((element) => {
            const tempArray = this.state.markers.slice();
            const marker = L.marker([element.szerokosc, element.dlugosc],
                { icon: config.myIcon }).addTo(this.state.map);
            marker.bindPopup(
                `${element.skrot}
                <a target='_blank' href = http://test.radiopolska.pl/wykaz/obiekt/${element.id_obiekt}>
                ${element.obiekt}</a><br>
                <b>${element.program}</b><br>
                Częstotliwość: ${element.mhz} MHz ${element.kategoria}<br>
                PI: ${element.pi} ERP: ${element.erp}kW Pol: ${element.polaryzacja}<br>
                Wys. podst. masztu: ${element.wys_npm}m n.p.m<br>
                Wys. umieszcz. nadajnika: ${element.antena_npt}m n.p.t`);
            tempArray.push(marker);
            this.setState({ markers: tempArray }, () => { });
        });
    }

    setView() {
        let latitude = 0;
        let longitude = 0;
        if (this.state.selectedTransmitters.length) {
            this.state.selectedTransmitters.forEach((element) => {
                latitude += Number(element.szerokosc);
                longitude += Number(element.dlugosc);
            });
            this.state.map.setView(new L.LatLng(latitude / this.state.selectedTransmitters.length,
                longitude / this.state.selectedTransmitters.length), 7);
        }
    }

    init(id) {
        if (this.state.map) return;
    // this function creates the Leaflet map object and is called after the Map component mounts
        const map = L.map(id, config.params);
        L.control.zoom({ position: 'bottomleft' }).addTo(map);
        this.layersGroup = new L.LayerGroup();
        this.layersGroup.addTo(map);
        // L.control.scale({ position: 'bottomleft' }).addTo(map);
    // a TileLayer is used as the "basemap"
        const tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);

    // set our state to include the tile layer
        this.setState({ map, tileLayer });
    }

    render() {
        const mapRef = (node) => { this.mapNode = node; };
        return (
            <div id="mapUI">
                <div ref={mapRef} id="map" />
            </div>
        );
    }
}

export default Map;
