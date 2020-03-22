export const shouldSetView = (props, prevProps) => props.configuration === prevProps.configuration
  && props.directional === prevProps.directional
  && props.automaticZoom;

export const shouldDrawLayers = (props, prevProps) => props.selectedTransmitters !== prevProps.selectedTransmitters
  || props.configuration.cfg !== prevProps.configuration.cfg;

export const shouldClearAllLayers = (props, prevProps) => props.selectedTransmitters.length === 0
  || (props.selectedTransmitters.length === 1 && !props.drawMultiple)
  || props.configuration !== prevProps.configuration;

export const layersDifference = (transmitters, ids) => {
  let toAdd = false;
  if (transmitters.length > ids.length) {
    toAdd = true;
  }

  const transmittersIDs = transmitters.map((el) => el.id_nadajnik);
  const layersIDs = ids.map((el) => Object.keys(el)[0]);
  let difference = [];

  if (toAdd) {
    difference = transmittersIDs.filter((id) => !layersIDs.includes(id));
    difference = transmitters.filter((el) => difference.includes(el.id_nadajnik));
  } else {
    difference = layersIDs.filter((id) => !transmittersIDs.includes(id));
    difference = ids.filter((el) => difference.includes(Object.keys(el)[0]));
  }

  return { difference, toAdd };
};
