import React, { Component } from 'react';
import L from 'leaflet';

// postCSS import of Leaflet's CSS
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';

const parseString = require('react-native-xml2js').parseString;
// const tj = require('togeojson');
// const fs = require('fs-react');
// const DOMParser = require('xmldom').DOMParser;

// const XMLParser = require('xml2json');

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
    iconUrl: '../../images/antenna-3.png',
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
            selectedStations: props.selectedStations,
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
        if (this.props.selectedStations !== prevProps.selectedStations) {
            this.state.selectedStations = this.props.selectedStations;
            this.layersGroup.clearLayers();
            this.state.markers.forEach((element) => { this.map.removeLayer(element); });
            this.state.markers = [];
            this.state.selectedStations.forEach((element) => {
                fetch(`http://home.elka.pw.edu.pl/~jklocek/current/${element.kml}`)
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
        }
    }

    componentWillUnmount() {
    // code to run just before unmounting the component
    // this destroys the Leaflet map object & related event listeners
        this.state.map.remove();
    }

    addLayer(kml) {
        console.log(kml);
        const boundsArray = [];
        // const averageBounds = [0, 0];

        boundsArray.push(Number(kml.LatLonBox[0].east[0]));
        boundsArray.push(Number(kml.LatLonBox[0].north[0]));
        boundsArray.push(Number(kml.LatLonBox[0].south[0]));
        boundsArray.push(Number(kml.LatLonBox[0].west[0]));

        console.log(boundsArray);
        // const imageBounds = [[boundsArray[1] - 0.025, boundsArray[3]], [boundsArray[0] - 0.025, boundsArray[2]]];
        const imageBounds = [[boundsArray[2], boundsArray[3]], [boundsArray[1], boundsArray[0]]];
        const imageUrl = `Maps/${kml.name[0]}`;
        this.layersGroup.addLayer(L.imageOverlay(`http://home.elka.pw.edu.pl/~jklocek/current/${imageUrl}`, imageBounds, { opacity: 0.6 }));
        // const centerBounds = [];
        // centerBounds[0] = (boundsArray[0] + boundsArray[1]) / 2;
        // centerBounds[1] = (boundsArray[2] + boundsArray[3]) / 2;
        // const marker = L.marker([centerBounds[0], centerBounds[1]], { icon: config.myIcon }).addTo(this.map);
        // marker.bindPopup(`<b>${element.name}</b><br><a target='_blank' href = ${element.linkToRP}>$
        //     {element.transmitter}</a>`);
        // this.markers.push(marker);
        // averageBounds[0] += centerBounds[0];
        // averageBounds[1] += centerBounds[1];

        // console.log(this.state.kml);
        // console.log(averageBounds);
        // this.setView(averageBounds[0] / this.state.selectedStations.length, averageBounds[1]
        //     / this.state.selectedStations.length);
    }

    setView(latitude, longitude) {
        this.state.map.fitBounds(new L.LatLng(latitude, longitude), 7);
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
