import React, { Component } from 'react';
import L from 'leaflet';

// postCSS import of Leaflet's CSS
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';

const icon = require('../../images/antenna-3.png');

const parseString = require('react-native-xml2js').parseString;

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
    uri: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    params: {
        minZoom: 5,
        attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        id: '',
        accessToken: '',
    },
};
config.myIcon = L.icon({
    iconUrl: icon,
    iconSize: [35, 40],
    // iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            tileLayer: null,
            selectedTransmitters: props.selectedTransmitters,
            markers: [],
            layersGroup: [],
        };
        this.mapNode = null;
        // this.setView = this.setView.bind(this);
    }

    componentDidMount() {
    // create the Leaflet map object
        if (!this.state.map) this.init(this.mapNode);
    }

    componentDidUpdate(prevProps) {
    // code to run when the component receives new props or state
        if (this.props.selectedTransmitters !== prevProps.selectedTransmitters) {
            this.state.selectedTransmitters = this.props.selectedTransmitters;
            this.layersGroup.clearLayers();
            this.state.markers.forEach((element) => { this.state.map.removeLayer(element); });
            this.state.markers = [];
            this.state.selectedTransmitters.forEach((element) => {
                fetch(`http://home.elka.pw.edu.pl/~jklocek/current/Maps/${element.id_nadajnik}.kml`)
                    .then(res => res.text())
                    .then(
                        (res) => {
                            parseString(res, (err, result) => {
                                const tempKml = result.kml.GroundOverlay[0];
                                this.addLayer(tempKml);
                            });
                        },
                        (error) => {
                            console.log(`Error${error}`);
                        },
                    );
            });
            this.setView();
        }
    }

    componentWillUnmount() {
    // code to run just before unmounting the component
    // this destroys the Leaflet map object & related event listeners
        this.state.map.remove();
    }

    addLayer(kml) {
        const boundsArray = [];
        // const averageBounds = [0, 0];

        boundsArray.push(Number(kml.LatLonBox[0].east[0]));
        boundsArray.push(Number(kml.LatLonBox[0].north[0]));
        boundsArray.push(Number(kml.LatLonBox[0].south[0]));
        boundsArray.push(Number(kml.LatLonBox[0].west[0]));

        const imageBounds = [[boundsArray[2], boundsArray[3]], [boundsArray[1], boundsArray[0]]];
        const imageUrl = `Maps/${kml.name[0]}`;
        this.layersGroup.addLayer(L.imageOverlay(`http://home.elka.pw.edu.pl/~jklocek/current/${imageUrl}`, imageBounds, { opacity: 0.6 }));
        this.addMarkers();
    }

    addMarkers() {
        this.state.markers.forEach((marker) => { this.state.map.removeLayer(marker); });
        this.setState({ markers: [] }, function () {
            console.log(this.state.markers);
        });

        this.state.selectedTransmitters.forEach((element) => {
            const tempArray = this.state.markers.slice();
            const marker = L.marker([element.szerokosc, element.dlugosc],
                { icon: config.myIcon }).addTo(this.state.map);
            marker.bindPopup(`<b>${element.program}</b><br><a target='_blank'
                href = http://test.radiopolska.pl/wykaz/obiekt/${element.id_obiekt}>${element.obiekt}</a>`);
            tempArray.push(marker);
            this.setState({ markers: tempArray }, function () {
                console.log(this.state.markers);
            });
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
        return (
            <div id="mapUI">
                <div ref={node => this.mapNode = node} id="map" />
            </div>
        );
    }
}

export default Map;
