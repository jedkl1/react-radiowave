import React, { Component } from 'react';
import L from 'leaflet';

import proj4 from 'proj4';

// postCSS import of Leaflet's CSS
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';

const icon = require('../../images/antenna-3-marker.png');
const gpsIcon = require('../../images/receiver.png');

const parseString = require('react-native-xml2js').parseString;


/* eslint no-underscore-dangle: 0 */

// store the map configuration properties in an object,
// we could also move this to a separate file & import it if desired.
const config = {};

config.params = {
    center: [52.1, 20.3],
    crs: L.CRS.EPSG3857,
    zoomControl: false,
    zoom: 7,
    maxZoom: 18,
    minZoom: 3,
    worldCopyJump: true,
};
config.tileLayer = {
    // uri: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
    uri: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    // uri: 'http://b.tile.stamen.com/terrain/{z}/{x}/{y}.png',
    // uri: 'https://maps.omniscale.net/v2/myomniscale-d7a6ecbd/style.default/{z}/{x}/{y}.png',
    params: {
        // minZoom: 5,
        // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        // id: 'mapbox.outdoors',
        id: '',
        // accessToken: 'sk.eyJ1IjoiamVka2wiLCJhIjoiY2poZ2t6angxMWp0dzMwbzZsNG5uOWhlbyJ9.GFjxyXSEOU2ImK4c-CLm0A',
        accessToken: '',
        // accessToken: 'myomniscale-d7a6ecbd',
    },
};

config.myIcon = L.icon({
    iconUrl: icon,
    iconSize: [30, 65],
    // iconAnchor: [22, 94],
    popupAnchor: [0, -35],
});

config.gpsIcon = L.icon({
    iconUrl: gpsIcon,
    iconSize: [30, 65],
    // iconAnchor: [22, 94],
    popupAnchor: [-10, -35],
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
        setInterval(navigator.geolocation.getCurrentPosition((e) => {
            this.setState({
                geoLat: e.coords.latitude, geoLon: e.coords.longitude }, () => {
                const marker = L.marker([this.state.geoLat, this.state.geoLon],
                        { icon: config.gpsIcon }).addTo(this.state.map);
                marker.bindPopup(
                    'Twoja pozycja');
            });
        }), 3000);
    }

    componentDidUpdate(prevProps) {
    // code to run when the component receives new props or state
        if (this.props.selectedTransmitters !== prevProps.selectedTransmitters ||
            this.props.configuration !== prevProps.configuration || this.props.directional !== prevProps.directional) {
            this.state.selectedTransmitters = this.props.selectedTransmitters;
            this.layersGroup.clearLayers();
            this.state.directionalChars.forEach((element) => { this.state.map.removeLayer(element); });
            this.state.directionalChars = [];
            this.drawLayersCharsMarkers();
            this.addMarkers();
            if (prevProps.configuration === this.props.configuration &&
                this.props.directional === prevProps.directional) {
                // this.setView();
            }
        } else if (this.props.selectedMarkers !== prevProps.selectedMarkers) {
            this.addMarkers();
        }
    }

    componentWillUnmount() {
    // code to run just before unmounting the component
    // this destroys the Leaflet map object & related event listeners
        this.state.map.remove();
    }

    async drawLayersCharsMarkers() {
        this.state.selectedTransmitters.forEach(async (element) => {
            if (element.typ === this.props.system) {
                await fetch(`https://mapy.radiopolska.pl/files/get/${this.props.configuration.cfg}/${element._mapahash}.kml`)
                    .then(res => res.text())
                    .then(
                        (res) => {
                            parseString(res, (err, result) => {
                                const kml = result.kml.GroundOverlay[0];

                                const boundsArray = [];

                                boundsArray.push(Number(kml.LatLonBox[0].east[0]));
                                boundsArray.push(Number(kml.LatLonBox[0].north[0]));
                                boundsArray.push(Number(kml.LatLonBox[0].south[0]));
                                boundsArray.push(Number(kml.LatLonBox[0].west[0]));
                                // const corner1 = L.latLng(boundsArray[1], boundsArray[0]);
                                // const corner2 = L.latLng(boundsArray[2], boundsArray[3]);

                                const c1 = proj4(proj4('WGS84'),
                                                 proj4('EPSG:3857'), [boundsArray[1], boundsArray[0]]);
                                const c2 = proj4(proj4('EPSG:4326'),
                                                 proj4('EPSG:3857'), [boundsArray[2], boundsArray[3]]);
                                // const corner2 = proj4(proj4('EPSG:4326'),
                                // proj4('EPSG:3857'), [boundsArray[2], boundsArray[3]]);

                                // const corner1 = L.point(6918587.72, 2416467.85);
                                // const corner2 = L.point(6283490.59, 1781790.90);

                                console.log(c1, c2);
                                // const bounds = L.latLngBounds(this.state.map.layerPointToLatLng(c1),
                                //                               this.state.map.layerPointToLatLng(c2));

                                // const bounds = L.latLng(element.szerokosc, element.dlugosc).toBounds(300000);

                                console.log(L.point(c1));
                                console.log(this.state.map.unproject(L.point(c1)));
                                console.log(this.state.map.layerPointToLatLng(c1));
                                console.log(L.bounds(c1, c2));
                                this.layersGroup.addLayer(L.imageOverlay(
                                    `https://mapy.radiopolska.pl/files/get/${this.props.configuration.cfg}/${element._mapahash}.png`,
                                    L.bounds(c1, c2), { opacity: 0.5 }));
                            });
                        },
                        (error) => {
                            console.log(`Error${error}`);
                        },
                        )
                    .then(
                            () => {
                                if (this.props.directional) {
                                    const tempArray = this.state.directionalChars.slice();
                                    const marker = L.marker([element.szerokosc, element.dlugosc],
                                                            { icon: L.icon({
                                                                iconUrl: `https://mapy.radiopolska.pl/files/ant_pattern/${element.id_antena}`,
                                                                iconSize: [130, 130],
                                                            }) }).addTo(this.state.map);
                                    tempArray.push(marker);
                                    this.setState({ directionalChars: tempArray }, () => { });
                                }
                            },
                        )
                    .then(
                        () => { this.addMarkers(); },
                    );
            }
        });
    }

    addLayer(kml, png) {
        const boundsArray = [];

        boundsArray.push(Number(kml.LatLonBox[0].east[0]));
        boundsArray.push(Number(kml.LatLonBox[0].north[0]));
        boundsArray.push(Number(kml.LatLonBox[0].south[0]));
        boundsArray.push(Number(kml.LatLonBox[0].west[0]));
        let corner1 = L.latLng(boundsArray[1], boundsArray[0]);
        const corner2 = L.latLng(boundsArray[2], boundsArray[3]);

        corner1 = this.state.map.project(corner1, 17);

        const bounds = L.latLngBounds(corner1, corner2);

        // const imageBounds = [[boundsArray[2], boundsArray[3]], [boundsArray[1], boundsArray[0]]];
        this.layersGroup.addLayer(L.imageOverlay(`https://mapy.radiopolska.pl/files/get/${this.props.configuration.cfg}/${png}`,
                                                 bounds, { opacity: 0.5 }));
        if (this.props.directional) {
            this.addDirectionalChar();
        }
    }

    addDirectionalChar() {
        this.state.directionalChars.forEach((marker) => { this.state.map.removeLayer(marker); });
        this.setState({ directionalChars: [] }, () => { });
        this.state.selectedTransmitters.forEach((element) => {
            if (element.typ === this.props.system) {
                const tempArray = this.state.directionalChars.slice();
                const marker = L.marker([element.szerokosc, element.dlugosc],
                                        { icon: L.icon({
                                            iconUrl: `https://mapy.radiopolska.pl/files/ant_pattern/${element.id_antena}`,
                                            iconSize: [130, 130],
                                        }) }).addTo(this.state.map);
                tempArray.push(marker);
                this.setState({ directionalChars: tempArray }, () => { });
            }
        });
    }

    addMarkers() {
        this.state.markers.forEach((marker) => { this.state.map.removeLayer(marker); });
        this.setState({ markers: [] }, () => { console.log('Markers removed'); });
        const tempArray = [];
        this.props.selectedMarkers.forEach((element) => {
            if (element.typ === this.props.system) {
                const marker = L.marker([element.szerokosc, element.dlugosc],
                { icon: config.myIcon }).addTo(this.state.map);
                if (this.props.system === 'fm') {
                    marker.bindPopup(
                        `${element.skrot}
                        <a target='_blank' href = http://test.radiopolska.pl/wykaz/obiekt/${element.id_obiekt}>
                        ${element.obiekt}</a><br>
                        <b>${element.program}</b><br>
                        Częstotliwość: ${element.mhz} MHz ${element.kategoria}<br>
                        PI: ${element.pi} ERP: ${element.erp}kW Pol: ${element.polaryzacja}<br>
                        Wys. podst. masztu: ${element.wys_npm}m n.p.m<br>
                        Wys. umieszcz. nadajnika: ${element.antena_npt}m n.p.t`);
                } else {
                    marker.bindPopup(
                        `${element.skrot}
                        <a target='_blank' href = http://test.radiopolska.pl/wykaz/obiekt/${element.id_obiekt}>
                        ${element.obiekt}</a><br>
                        <b>${element.multipleks}</b><br>
                        Częstotliwość: ${element.mhz} MHz ${element.kategoria}<br>
                        PI: ${element.pi} ERP: ${element.erp}kW Pol: ${element.polaryzacja}<br>
                        Wys. podst. masztu: ${element.wys_npm}m n.p.m<br>
                        Wys. umieszcz. nadajnika: ${element.antena_npt}m n.p.t`);
                }
                tempArray.push(marker);
            }
        });
        this.setState({ markers: tempArray }, () => { });
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
        // map.options.crs = L.CRS.EPSG4326;
        L.control.zoom({ position: 'bottomleft' }).addTo(map);
        this.layersGroup = new L.LayerGroup();
        this.layersGroup.addTo(map);
        // L.control.scale({ position: 'bottomleft' }).addTo(map);
    // a TileLayer is used as the "basemap"
        const tileLayer = new L.TileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);

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


// access_token = pk.eyJ1IjoiamVka2wiLCJhIjoiY2poZ2tzdGM2MWh6eDM2bmdwajJjYWM1MSJ9.eetF9FLkBjeuCg_fM4dDLg
