import React, { Component } from 'react';
import L from 'leaflet';
// import { ToastContainer, toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

import { fetchKMLsArray } from '../api/maps-layers';
import { postError } from '../api/errors';
import {
  shouldClearAllLayers,
  shouldDrawLayers,
  shouldSetView,
  layersDifference,
} from '../helpers/map';

import 'react-toastify/dist/ReactToastify.css';

// postCSS import of Leaflet's CSS
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';

const icon = require('../../images/icons/transmitter_half.png').default;
const gpsIcon = require('../../images/icons/yagi_half.png').default;

const { PROD_FILES_URL } = process.env;
const { PROD_LIST_URL } = process.env;

const config = {};

config.params = {
  center: [52.1, 20.3],
  zoomControl: false,
  zoom: 7,
  maxZoom: 18,
  minZoom: 4,
};
config.tileLayer = {
  uri: process.env.TILE_PROVIDER_1_URL,
  // uri: process.env.TILE_PROVIDER_2_URL,
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
      selectedTransmitters: [],
      newSelectedTransmitters: [],
      markers: [],
      directionalChars: [],
      gpsMarker: null,
      layersIDs: [],
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

  async componentDidUpdate(prevProps) {
    const { props } = this;

    if (prevProps.configuration) {
      if (shouldDrawLayers(props, prevProps)) {
        const { layersIDs } = this.state;
        if (shouldClearAllLayers(props, prevProps)) {
          if (layersIDs.length > 0 && !props.drawMultiple) {
            this.layersGroup.removeLayer(
              layersIDs[0][Object.keys(layersIDs[0])[0]].leafletId,
            );
          }
          this.clearDirectionalMarkers();
          this.layersGroup.clearLayers();
          this.state.layersIDs = [];

          await fetchKMLsArray(
            props.selectedTransmitters,
            props.configuration,
          ).then((res) => {
            this.state.selectedTransmitters = res;
            this.state.newSelectedTransmitters = res;
          });

          this.newDrawLayers();
        } else {
          const diff = layersDifference(props.selectedTransmitters, layersIDs);

          if (diff.toAdd) {
            await fetchKMLsArray(diff.difference, props.configuration).then(
              (res) => {
                const { selectedTransmitters } = this.state;
                this.setState(
                  {
                    selectedTransmitters: [...selectedTransmitters, ...res],
                    newSelectedTransmitters: [...res],
                  },
                  () => {
                    this.newDrawLayers();
                  },
                );
              },
            );
          } else {
            diff.difference.forEach((el) => {
              const id = el[Object.keys(el)[0]];

              this.layersGroup.removeLayer(id.leafletId);
              const newLayersIDs = layersIDs.filter((layer) => el !== layer);
              this.setState({ layersIDs: newLayersIDs });
            });
          }
        }

        if (shouldSetView(props, prevProps)) {
          this.setView();
        }
        this.drawDirectionalChars();
        this.addMarkers();
      } else if (props.selectedMarkers !== prevProps.selectedMarkers) {
        this.addMarkers();
      } else if (props.directional !== prevProps.directional) {
        this.clearDirectionalMarkers();
        this.drawDirectionalChars();
      }
    }
  }

  componentWillUnmount() {
    // this destroys the Leaflet map object & related event listeners
    const { map } = this.state;
    map.remove();
  }

  clearDirectionalMarkers() {
    const { directionalChars, map } = this.state;

    directionalChars.forEach((element) => {
      map.removeLayer(element);
    });
    this.setState({ directionalChars: [] });
  }

  newDrawLayers() {
    const { configuration } = this.props;
    let { newSelectedTransmitters } = this.state;

    let response = false;

    if (newSelectedTransmitters.length >= 30) {
      response = window.confirm(
        `Czy na pewno chcesz wyświetlić ${newSelectedTransmitters.length} mapek? 
        Grozi to utratą stabilności Twojej przeglądarki.
        W przeciwnym wypadku zostanie narysowanych pierwszych 30 pozycji z listy`,
      );
    }
    if (response === false) {
      newSelectedTransmitters = newSelectedTransmitters.slice(0, 30);
    }

    const { layersIDs } = this.state;
    const newLayersIDs = layersIDs;
    /* eslint no-underscore-dangle: 0 */
    newSelectedTransmitters.forEach((element) => {
      const url = `${PROD_FILES_URL}/get/${configuration.cfg}/${element._mapahash}.png`;
      fetch(url)
        .then((res) => {
          if (!res.ok) {
            postError({ code: res.status, method: 'GET', url });
          }
          return res;
        })
        .then(() => {
          const layer = L.imageOverlay(url, element.bounds, { opacity: 0.6 });
          this.layersGroup.addLayer(layer);
          newLayersIDs.push({
            [element.id_nadajnik]: { leafletId: layer._leaflet_id },
          });
        })
        .catch((e) => console.log(e));
    });

    this.setState({ layersIDs: newLayersIDs }, () => {});
    /* eslint no-underscore-dangle: 1 */
  }

  drawDirectionalChars() {
    const { directionalChars, map, selectedTransmitters } = this.state;
    const { directional } = this.props;

    if (directional) {
      const tempArray = directionalChars.slice();
      selectedTransmitters.forEach((element) => {
        const url = `${PROD_FILES_URL}/ant_pattern/${element.id_antena}`;
        fetch(url)
          .then((res) => {
            if (!res.ok) {
              postError({ code: res.status, method: 'GET', url });
            }
            return res;
          })
          .then(() => {
            const marker = L.marker([element.szerokosc, element.dlugosc], {
              icon: L.icon({
                iconUrl: url,
                iconSize: [130, 130],
              }),
            }).addTo(map);
            tempArray.push(marker);
          })
          .catch((e) => console.log(e));
      });
      this.setState({ directionalChars: tempArray }, () => {});
    }
  }

  // toast.error(
  //   `Niestety, mapa dla nadajnika ${element.mhz}MHz/ ${element.program}/ ${element.obiekt} nie jest jeszcze gotowa.
  //             Powiadom administrację o problemie`,
  //   {
  //     position: toast.POSITION.BOTTOM_CENTER,
  //   },
  // );

  addMarkers() {
    const { map, markers } = this.state;
    const { selectedMarkers, system } = this.props;

    markers.forEach((marker) => {
      map.removeLayer(marker);
    });
    this.setState({ markers: [] }, () => {});
    const tempArray = [];
    selectedMarkers.forEach((element) => {
      if (element.typ === system) {
        const marker = L.marker([element.szerokosc, element.dlugosc], {
          icon: config.myIcon,
        }).addTo(map);
        if (system === 'fm') {
          marker.bindPopup(
            `${element.skrot}
            <a target='_blank' href=${PROD_LIST_URL}/obiekt/${element.id_obiekt}>
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
            <a target='_blank' href=${PROD_LIST_URL}/obiekt/${element.id_obiekt}>
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
