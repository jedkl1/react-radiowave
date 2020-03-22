import L from 'leaflet';
import { xml2js } from 'xml-js';

import { postError } from './errors';
import { isValidElement } from '../validators/map-layers';

const { PROD_FILES_URL } = process.env;

/* eslint no-underscore-dangle: 0 */
const mapKMLToBounds = (response) => {
  const kml = xml2js(response, { ignoreAttributes: true, compact: true }).kml
    .GroundOverlay;
  const boundsArray = [];

  boundsArray.push(Number(kml.LatLonBox.east._text));
  boundsArray.push(Number(kml.LatLonBox.north._text));
  boundsArray.push(Number(kml.LatLonBox.south._text));
  boundsArray.push(Number(kml.LatLonBox.west._text));
  const corner1 = L.latLng(boundsArray[1], boundsArray[0]);
  const corner2 = L.latLng(boundsArray[2], boundsArray[3]);
  return L.latLngBounds(corner1, corner2);
};

const fetchKMLByMapHash = async (url) => {
  const response = await fetch(url).then((res) => {
    if (!res.ok) {
      postError({
        code: res.status,
        method: 'GET',
        url,
        msg: res.body,
      });
    }
    return { text: res.text(), status: res.status };
  });

  if ((await response.text).length && response.status === 200) {
    return response.text;
  }
  throw Error('Brak opisu mapy pokrycia o podanym id w bazie danych');
};

export const fetchKMLsArray = async (elements, configuration) => {
  const requests = elements.map((element) => {
    if (isValidElement(element, configuration)) {
      const url = `${PROD_FILES_URL}/get/${configuration.cfg}/${element._mapahash}.kml`;

      return fetchKMLByMapHash(url)
        .then((response) => {
          const bounds = mapKMLToBounds(response);

          return { ...element, bounds };
        })
        .catch((e) => console.error(e));
    }
    return 'invalid map layer input parameters';
  });

  return Promise.all(requests);
};
