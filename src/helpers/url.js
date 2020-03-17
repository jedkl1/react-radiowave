/**
 * Url @Params
 * z -> automatic zoom on map
 * m -> allow multiple layers
 * d -> draw directional characteristics
*/
export const generateUrl = (state) => {
  const {
    selectedConfiguration,
    toDrawSelected,
    system,
    automaticZoom,
    checkMultiple,
    directionalChecked,
  } = state;
  if (selectedConfiguration) {
    const { location } = window;
    const domain = window.location.port.length
      ? `${location.protocol}//${location.hostname}:${location.port}${location.pathname}`
      : `${location.protocol}//${location.hostname}${location.pathname}`;
    let url = domain;

    if (toDrawSelected.length) {
      url += '?tra=';
      url += toDrawSelected
        .map((element) => `${element.id_nadajnik}`)
        .join(',');
      url += `&cfg=${selectedConfiguration.cfg}`;
      url += `&sys=${system}`;
      url += `&z=${automaticZoom}`;
      url += `&m=${checkMultiple}`;
      url += `&d=${directionalChecked}`;
    }
    return url;
  }
  return '';
};

export const parseQueryToState = (query) => {
  const newState = {
    system: '',
    checkMultiple: false,
    automaticZoom: true,
    directionalChecked: true,
  };

  if (query.m) {
    newState.checkMultiple = query.m === 'true';
  }
  if (query.z) {
    newState.automaticZoom = query.z === 'true';
  }
  if (query.d) {
    newState.directionalChecked = query.d === 'true';
  }
  if (query.sys) {
    newState.system = query.sys;
  }

  return newState;
};
