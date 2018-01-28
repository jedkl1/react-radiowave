import React, { Component } from 'react';
import L from 'leaflet';

// postCSS import of Leaflet's CSS
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';

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

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            tileLayer: null,
        };
        this.mapNode = null;
    }

    componentDidMount() {
    // create the Leaflet map object
        if (!this.state.map) this.init(this.mapNode);
    }

    componentDidUpdate() {
    // code to run when the component receives new props or state
    }

    componentWillUnmount() {
    // code to run just before unmounting the component
    // this destroys the Leaflet map object & related event listeners
        this.state.map.remove();
    }

    init(id) {
        if (this.state.map) return;
    // this function creates the Leaflet map object and is called after the Map component mounts
        const map = L.map(id, config.params);
        L.control.zoom({ position: 'bottomleft' }).addTo(map);
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
