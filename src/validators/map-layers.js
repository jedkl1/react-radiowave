/* eslint no-underscore-dangle: 0 */

export const isValidElement = (element, configuration) => (
  !!element.typ
  && element._mapahash
  && element.id_antena
  && configuration.cfg
);
