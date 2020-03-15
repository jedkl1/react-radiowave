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
      url += `&cfg=${selectedConfiguration.cfg}&`;
      url += `sys=${system}&`;
      url += `z=${automaticZoom}&`;
      url += `m=${checkMultiple}&`;
      url += `d=${directionalChecked}`;
    }
    return url;
  }
  return '';
};
