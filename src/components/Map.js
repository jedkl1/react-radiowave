import React, { Component } from 'react';
import L from 'leaflet';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// postCSS import of Leaflet's CSS
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';

const { parseString } = require('react-native-xml2js');
const icon = require('../../images/icons/transmitter_half.png').default;
const gpsIcon = require('../../images/icons/yagi_half.png').default;

/* eslint no-underscore-dangle: 0 */

// store the map configuration properties in an object,
// we could also move this to a separate file & import it if desired.
const config = {};

config.params = {
  center: [52.1, 20.3],
  zoomControl: false,
  zoom: 7,
  maxZoom: 18,
  minZoom: 4,
};
config.tileLayer = {
  uri: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
  params: {
    minZoom: 4,
    maxZoom: 16,
    attribution:
      'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    id: '',
    accessToken: '',
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
      selectedTransmitters: props.selectedTransmitters,
      markers: [],
      directionalChars: [],
      gpsMarker: null,
      interval: null,
    };
    this.mapNode = null;
    this.gpsChanged = this.gpsChanged.bind(this);
    this.checkGeoLocation = this.checkGeoLocation.bind(this);
    // this.setView = this.setView.bind(this);
  }

  gpsChanged(pos) {
    const { map, gpsMarker } = this.state;

    if (gpsMarker) {
      map.removeLayer(gpsMarker); // removing old one
    }

    const marker = L.marker([pos.coords.latitude, pos.coords.longitude], {
      icon: config.gpsIcon,
    }).addTo(map);
    marker.bindPopup('Twoja pozycja');
    this.setState({ gpsMarker: marker });
    setTimeout(this.checkGeoLocation, 3000);
  }

  checkGeoLocation() {
    navigator.geolocation.getCurrentPosition(this.gpsChanged, (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    });
  }

  componentDidMount() {
    const { map } = this.state;
    // create the Leaflet map object
    if (!map) this.init(this.mapNode);

    // check user position in every second
    this.checkGeoLocation();
    setTimeout(this.checkGeoLocation, 5000);
  }

  componentDidUpdate(prevProps) {
    const {
      automaticZoom,
      configuration,
      directional,
      selectedMarkers,
      selectedTransmitters,
    } = this.props;

    if (prevProps.configuration) {
      if (
        selectedTransmitters !== prevProps.selectedTransmitters
        || configuration.cfg !== prevProps.configuration.cfg
        || directional !== prevProps.directional
      ) {
        this.state.selectedTransmitters = selectedTransmitters;
        this.layersGroup.clearLayers();
        this.drawLayersCharsMarkers();
        this.addMarkers();
        if (
          prevProps.configuration === configuration
          && directional === prevProps.directional
          && automaticZoom
        ) {
          this.setView();
        }
      } else if (selectedMarkers !== prevProps.selectedMarkers) {
        this.addMarkers();
      } else if (directional !== prevProps.directional && !directional) {
        const { directionalChars, map } = this.state;

        directionalChars.forEach((element) => {
          map.removeLayer(element);
        });
        this.state.directionalChars = [];
      }
    }
  }

  componentWillUnmount() {
    // code to run just before unmounting the component
    // this destroys the Leaflet map object & related event listeners
    const { interval, map } = this.state;

    map.remove();
    clearInterval(interval);
  }

  async drawLayersCharsMarkers() {
    const { directionalChars, map, selectedTransmitters } = this.state;

    directionalChars.forEach((marker) => {
      map.removeLayer(marker);
    });
    this.setState({ directionalChars: [] }, () => {});
    let response = false;
    if (selectedTransmitters.length >= 30) {
      response = Window.confirm(`Czy na pewno chcesz wyświetlić ${selectedTransmitters.length} mapek?
Grozi to utratą stabilności Twojej przeglądarki.
W przeciwnym wypadku zostanie narysowanych pierwszych 30 pozycji z listy`);
    }
    for (
      let i = 0, p = Promise.resolve();
      i < selectedTransmitters.length;
      i += 1
    ) {
      if (i === 30 && response === false) {
        break;
      }
      p = p.then(
        () => new Promise((resolve) => {
          const element = selectedTransmitters[i];
          const { configuration, directional, system } = this.props;

          if (
            element.typ === system
              && element._mapahash
              && element.id_antena
              && configuration.cfg
          ) {
            fetch(
              `https://mapy.radiopolska.pl/files/get/${configuration.cfg}/${element._mapahash}.kml`,
            )
              .then((res) => res.text())
              .then(
                (res) => {
                  parseString(res, (err, result) => {
                    const kml = result.kml.GroundOverlay[0];

                    const boundsArray = [];

                    boundsArray.push(Number(kml.LatLonBox[0].east[0]));
                    boundsArray.push(Number(kml.LatLonBox[0].north[0]));
                    boundsArray.push(Number(kml.LatLonBox[0].south[0]));
                    boundsArray.push(Number(kml.LatLonBox[0].west[0]));
                    const corner1 = L.latLng(boundsArray[1], boundsArray[0]);
                    const corner2 = L.latLng(boundsArray[2], boundsArray[3]);
                    const bounds = L.latLngBounds(corner1, corner2);
                    this.layersGroup.addLayer(
                      L.imageOverlay(
                        `https://mapy.radiopolska.pl/files/get/${configuration.cfg}/${element._mapahash}.png`,
                        bounds,
                        { opacity: 0.6 },
                      ),
                    );

                    this.layersGroup.addTo(map);
                  });
                  if (directional) {
                    const tempArray = directionalChars.slice();
                    const marker = L.marker(
                      [element.szerokosc, element.dlugosc],
                      {
                        icon: L.icon({
                          iconUrl: `https://mapy.radiopolska.pl/files/ant_pattern/${element.id_antena}`,
                          iconSize: [130, 130],
                        }),
                      },
                    ).addTo(map);
                    tempArray.push(marker);
                    this.setState({ directionalChars: tempArray }, () => {});
                  }
                  this.addMarkers();
                  resolve();
                },
                (error) => {
                  console.log();
                  console.log(`Error${error}`);
                },
              )
              .catch((err) => {
                console.error(
                  `${err} in transmitter ${element.id_nadajnik} for ${element.typ}`,
                );
                toast.error(
                  `Niestety, mapa dla nadajnika ${element.mhz}MHz/ ${element.program}/ ${element.obiekt} nie jest jeszcze gotowa.
                            Powiadom administrację o problemie`,
                  {
                    position: toast.POSITION.BOTTOM_CENTER,
                  },
                );
              });
          } else {
            console.error(element);
            // toast.error(`Niestety, mapa dla nadajnika ${element.mhz}MHz/ ${element.program}/
            // ${element.obiekt} nie jest jeszcze gotowa.
            //         Powiadom administrację o problemie`, {
            //             position: toast.POSITION.BOTTOM_CENTER,
            //         });
            resolve();
          }
        }),
      );
    }
  }

  addLayer(kml, png) {
    const { map } = this.state;
    const { configuration } = this.props;

    const boundsArray = [];

    boundsArray.push(Number(kml.LatLonBox[0].east[0]));
    boundsArray.push(Number(kml.LatLonBox[0].north[0]));
    boundsArray.push(Number(kml.LatLonBox[0].south[0]));
    boundsArray.push(Number(kml.LatLonBox[0].west[0]));
    let corner1 = L.latLng(boundsArray[1], boundsArray[0]);
    const corner2 = L.latLng(boundsArray[2], boundsArray[3]);

    corner1 = map.project(corner1, 17);

    const bounds = L.latLngBounds(corner1, corner2);

    // const imageBounds = [[boundsArray[2], boundsArray[3]], [boundsArray[1], boundsArray[0]]];
    this.layersGroup.addLayer(
      L.imageOverlay(
        `https://mapy.radiopolska.pl/files/get/${configuration.cfg}/${png}`,
        bounds,
        { opacity: 0.5 },
      ),
    );

    const { directional } = this.props;

    if (directional) {
      this.addDirectionalChar();
    }
  }

  addDirectionalChar() {
    const { directionalChars, map, selectedTransmitters } = this.state;
    const { system } = this.props;

    directionalChars.forEach((marker) => {
      map.removeLayer(marker);
    });
    this.setState({ directionalChars: [] }, () => {});
    selectedTransmitters.forEach((element) => {
      if (element.typ === system) {
        const tempArray = directionalChars.slice();
        const marker = L.marker([element.szerokosc, element.dlugosc], {
          icon: L.icon({
            iconUrl: `https://mapy.radiopolska.pl/files/ant_pattern/${element.id_antena}`,
            iconSize: [130, 130],
          }),
        }).addTo(map);
        tempArray.push(marker);
        this.setState({ directionalChars: tempArray }, () => {});
      }
    });
  }

  addMarkers() {
    const { map, markers } = this.state;
    const { selectedMarkers, system } = this.props;

    markers.forEach((marker) => {
      map.removeLayer(marker);
    });
    this.setState({ markers: [] }, () => {
      console.log('Markers removed');
    });
    const tempArray = [];
    selectedMarkers.forEach((element) => {
      if (element.typ === system) {
        const marker = L.marker([element.szerokosc, element.dlugosc], {
          icon: config.myIcon,
        }).addTo(map);
        if (system === 'fm') {
          marker.bindPopup(
            `${element.skrot}
                        <a target='_blank' href = http://radiopolska.pl/wykaz/obiekt/${element.id_obiekt}>
                        ${element.obiekt}</a><br>
                        <b>${element.program}</b><br>
                        Częstotliwość: ${element.mhz} MHz ${element.kategoria}<br>
                        PI: ${element.pi} ERP: ${element.erp}kW Pol: ${element.polaryzacja}<br>
                        Wys. podst. masztu: ${element.wys_npm}m n.p.m<br>
                        Wys. umieszcz. nadajnika: ${element.antena_npt}m n.p.t`,
          );
        } else {
          marker.bindPopup(
            `${element.skrot}
                        <a target='_blank' href = http://radiopolska.pl/wykaz/obiekt/${element.id_obiekt}>
                        ${element.obiekt}</a><br>
                        <b>${element.multipleks}</b><br>
                        Częstotliwość: ${element.mhz} MHz ${element.kategoria}<br>
                        ERP: ${element.erp}kW Pol: ${element.polaryzacja}<br>
                        Wys. podst. masztu: ${element.wys_npm}m n.p.m<br>
                        Wys. umieszcz. nadajnika: ${element.antena_npt}m n.p.t`,
          );
        }
        tempArray.push(marker);
      }
    });
    this.setState({ markers: tempArray }, () => {});
  }

  setView() {
    const { map, selectedTransmitters } = this.state;

    let latitude = 0;
    let longitude = 0;
    if (selectedTransmitters.length) {
      selectedTransmitters.forEach((element) => {
        latitude += Number(element.szerokosc);
        longitude += Number(element.dlugosc);
      });
      map.setView(
        new L.LatLng(
          latitude / selectedTransmitters.length - 0.3,
          longitude / selectedTransmitters.length,
        ),
        7,
      );
    }
  }

  init(id) {
    const { map } = this.state;

    if (map) return;
    // this function creates the Leaflet map object and is called after the Map component mounts

    const newMap = L.map(id, config.params);
    L.control.zoom({ position: 'bottomright' }).addTo(newMap);
    this.layersGroup = new L.LayerGroup();
    this.layersGroup.addTo(newMap);
    // L.control.scale({ position: 'bottomleft' }).addTo(map);
    // a TileLayer is used as the "basemap"
    new L.TileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(
      newMap,
    );

    // set our state to include the tile layer
    this.setState({ map: newMap });
  }

  render() {
    const mapRef = (node) => {
      this.mapNode = node;
    };
    return (
      <div id="mapUI">
        <div ref={mapRef} id="map" />
        <ToastContainer autoClose={5000} />
      </div>
    );
  }
}

export default Map;
